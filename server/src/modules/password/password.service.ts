import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma"
import { CreatePasswordDto } from "./dto/create.input.dto";
import { encrypt } from "src/utils/cipher.utils";
import { EditPasswordDto } from "./dto/edit.input.dto";
import { exec } from "child_process";
import { PasswordQueryParamsDto } from "./dto/password.queryparams.dto";
@Injectable()
export class PasswordService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async createPassword(payload: CreatePasswordDto, userId: string): Promise<any> {
        // console.log({userId})
        if (!userId) return { success: false, error: "User not found" };
        try {
            const { encrypted, iv } = encrypt(payload.password);
            const team = payload.teamId ?
                await this.prisma.team.findFirst({
                    where: {
                        id: payload.teamId,
                        userTeam:{
                            some:{
                                userId
                            }
                        }
                    }
                })
                :
                await this.prisma.team.findFirst({
                    where: {
                        userId,
                        personal: true
                    }
                })
            if (!team) return { success: false, error: "Team not found!" }
            const group = payload.groupId ?
                await this.prisma.group.findFirst({
                    where: {
                        id: payload.groupId,
                        teamId: team.id
                    }
                })
                :
                await this.prisma.group.findFirst({
                    where: {
                        teamId: team.id,
                        default: true
                    }
                })
            if (!group) return { success: false, error: "Group not found!" }
            const password = await this.prisma.password.create({
                data: {
                    name: payload.name,
                    encrypted,
                    iv,
                    userId: userId,
                    teamId: team.id,
                    groupId: group.id,
                    public: payload.public?payload.public==="true":false,
                    views: payload.views?parseInt(payload.views):0
                },
                select: {
                    id: true,
                    name: true,
                    public: true,
                    views: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            username: true
                        }
                    },
                    team: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    group: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })
            return { success: true, password };
        } catch (error) {
            console.log({ error })
            return { success: false, error }
        }
    }

    async getPassword(userId: string, passId: string): Promise<any> {
        if (!userId || !passId) return { success: false, error: "User not found" };
        const passwordData = await this.prisma.password.findUnique({
            where: {
                id: passId,
                team: {
                    userTeam: {
                        some: {
                            userId,
                            accepted: true
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                encrypted: true,
                public: true,
                views: true,
                iv: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
        if (!passwordData) return { success: false, error: "Password not found" }
        // const password = decrypt(passwordData.encrypted, passwordData.iv)
        return { success: true, password: passwordData }
    }

    async getPublicPassword(passId: string): Promise<any> {
        if (!passId) return { success: false, error: "Password not found" };
        const passwordData = await this.prisma.password.findUnique({
            where: {
                id: passId,
                public: true,
                views: { gt: 0 }
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                public: true,
                views: true,
                encrypted: true,
                iv: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
        if (!passwordData) return { success: false, error: "Password not found" }
        const editPassword = await this.prisma.password.update({
            where: {
                id: passwordData.id
            },
            data: {
                views: { decrement: 1 },
                public: passwordData.views > 1
            }
        })
        return { success: true, password: passwordData }
    }

    async getAll(userId: string) {
        if (!userId) return { success: false, error: "User not found" };
        const passwords = await this.prisma.password.findMany({
            where: {
                team: {
                    userTeam: {
                        some: {
                            userId,
                            accepted: true
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                public: true,
                views: true,
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                }

            }
        })
        return { passwords, success: true }
    }

    async getAllGeneral({ userId, passwordQueryParams }: { userId: string, passwordQueryParams: PasswordQueryParamsDto }) {
        passwordQueryParams = Object.assign(new PasswordQueryParamsDto(), passwordQueryParams)
        if (!userId) return { success: false, error: "User not found" };
        // console.log(passwordQueryParams)
        let whereQuery:{teamId?:string, groupId?:string, public?:boolean} = passwordQueryParams.teamId!==""?{teamId:passwordQueryParams.teamId}:{}
        whereQuery= passwordQueryParams.groupId!==""?{...whereQuery, groupId:passwordQueryParams.groupId}:whereQuery
        whereQuery = passwordQueryParams.isPublic?{...whereQuery,public:true}:whereQuery

        const passwords = await this.prisma.password.findMany({
            where: {
                ...whereQuery,
                team:{
                    userTeam:{
                        some:{
                            userId
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                public: true,
                views: true,
                team: {
                    select: {
                        id: true,
                        name: true,
                        _count:{
                            select:{
                                userTeam:{
                                    where:{
                                        accepted:true
                                    }
                                }
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                

            },
            take:passwordQueryParams.limit,
            skip:passwordQueryParams.limit*passwordQueryParams.offset,
            orderBy:passwordQueryParams.orderBy==="name"?{name:"asc"}:{createdAt:"asc"}
        })
        return { passwords, success: true }
    }

    async searchPassword({ userId, searchTerm }: { userId: string, searchTerm: string }) {
        // passwordQueryParams = Object.assign(new PasswordQueryParamsDto(), passwordQueryParams)
        if (!userId) return { success: false, error: "User not found" };
        // console.log(passwordQueryParams)
        // let whereQuery:{teamId?:string, groupId?:string, public?:boolean} = passwordQueryParams.teamId!==""?{teamId:passwordQueryParams.teamId}:{}
        // whereQuery= passwordQueryParams.groupId!==""?{...whereQuery, groupId:passwordQueryParams.groupId}:whereQuery

        const passwords = await this.prisma.password.findMany({
            where: {
                name:{contains:searchTerm, mode:"insensitive"},
                team:{
                    userTeam:{
                        some:{
                            userId,
                            accepted:true
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                public: true,
                views: true,
                team: {
                    select: {
                        id: true,
                        name: true,
                        _count:{
                            select:{
                                userTeam:{
                                    where:{
                                        accepted:true
                                    }
                                }
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                

            },
        })
        return { passwords, success: true }
    }

    async getAllMy(userId: string) {
        if (!userId) return { success: false, error: "User not found" };
        const passwords = await this.prisma.password.findMany({
            where: {
                team: {
                    userId: userId,
                    personal: true
                }
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                public: true,
                views: true,
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                }

            }
        })
        return { passwords, success: true }
    }

    async editPassword(payload: CreatePasswordDto, userId: string, passId: string): Promise<any> {
        if (!userId || !passId) return { success: false, error: "Password not found" };
        const passwordData = await this.prisma.password.findUnique({
            where: {
                id: passId,
                team: {
                    userTeam: {
                        some: {
                            userId: userId,
                            accepted: true
                        }
                    }
                }
            }
        })
        if (!passwordData) return { success: false, error: "Password not found" };
        const { encrypted, iv } = payload.password ? encrypt(payload.password) : { encrypted: passwordData.encrypted, iv: passwordData.iv };
        const updatedPasswordData = await this.prisma.password.update({
            where: {
                id: passwordData.id,
            },
            data: {
                name: payload.name ? payload.name : passwordData.name,
                encrypted,
                iv,
                public: payload.public ? payload.public === "true" : passwordData.public,
                views: payload.views ? parseInt(payload.views) : passwordData.views,
                teamId:payload.teamId? payload.teamId : passwordData.teamId,
                groupId:payload.groupId? payload.groupId : passwordData.groupId
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                public: true,
                views: true,
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
        return { success: true, password: updatedPasswordData }
    }

    async deletePassword(userId: string, passId: string): Promise<any> {
        if (!userId || !passId) return { success: false, error: "Password not found" };
        const passwordData = await this.prisma.password.findFirst({
            where: {
                id: passId,
                team: {
                    userTeam: {
                        some: {
                            userId: userId,
                            accepted: true
                        }
                    }
                }
            }
        })
        if (!passwordData) return { success: false, error: "Password not found" };
        const deletedPasswordData = await this.prisma.password.delete({
            where: {
                id: passId
            }
        })
        return { success: true, password: deletedPasswordData }
    }

    async addToTeam(teamId: string, passId: string, userId: string): Promise<any> {
        if (!teamId || !passId) return { success: false, error: "Team or Password not found" }
        try {
            const team = await this.prisma.team.findFirst({
                where: {
                    id: teamId,
                    userTeam: {
                        some: {
                            userId,
                            accepted: true
                        }
                    }
                }
            })
            if (!team) return { success: false, error: "Team not found!" }
            const ogPassword = await this.prisma.password.findFirst({
                where: {
                    id: passId
                },
            })
            if (ogPassword.teamId === teamId) return { success: true }
            const group = await this.prisma.group.findFirst({
                where: {
                    teamId: teamId,
                    default: true
                }
            })
            const password = await this.prisma.password.update({
                where: {
                    id: passId,
                    userId: userId
                },
                data: {
                    teamId: teamId,
                    groupId: group.id
                }
            })
            if (!password) throw Error("Team or Password not found")
            return { success: true }
        } catch (error) {
            return { success: false, error: "Team or Password not found" }
        }
    }

    async subFromTeam(teamId: string, passId: string, userId: string): Promise<any> {
        if (!teamId || !passId) return { success: false, error: "Team or Password not found" }

        try {
            const password = await this.prisma.password.findFirst({
                where: {
                    id: passId,
                    teamId: teamId,
                    team: {
                        userTeam: {
                            some: {
                                userId,
                                accepted: true
                            }
                        },
                        personal: false
                    }
                }
            })
            if (!password) throw Error("Password could not be updated")

            const team = await this.prisma.team.findFirst({
                where: {
                    userId: password.userId,
                    personal: true
                }
            })
            if (!team) throw Error("Team not found")
            const group = await this.prisma.group.findFirst({
                where: {
                    userId: password.userId,
                    default: true
                }
            })
            const newPassword = await this.prisma.password.update({
                where: {
                    id: password.id
                },
                data: {
                    teamId: team.id,
                    groupId: group.id
                }
            })
            return { success: true }
        } catch (error) {
            // console.log(error)
            return { success: false, error: "Team or Password not found" }
        }
    }


    async addToGroup(groupId: string, passId: string, userId: string): Promise<any> {
        if (!groupId || !passId) return { success: false, error: "Group or Password not found" }
        try {

            const group = await this.prisma.group.findFirst({
                where: {
                    id: groupId,
                    team: {
                        userTeam: {
                            some: {
                                userId,
                                accepted: true
                            }
                        }
                    }
                }
            })
            if (!group) return { success: false, error: "Group not found!" }
            const password = await this.prisma.password.update({
                where: {
                    id: passId,
                    userId: userId,
                    teamId: group.teamId
                },
                data: {
                    groupId: groupId
                }
            })
            if (!password) throw Error("Group or Password not found")
            return { success: true, password }
        } catch (error) {
            return { success: false, error: "Group or Password not found" }
        }
    }

    async subFromGroup(groupId: string, passId: string, userId: string): Promise<any> {
        if (!groupId || !passId) return { success: false, error: "Group or Password not found" }
        try {
            const group = await this.prisma.group.findFirst({
                where: {
                    id: groupId,
                    default: false,
                    team: {
                        userTeam: {
                            some: {
                                userId,
                                accepted: true
                            }
                        }
                    }
                }
            })
            if (!group) return { success: false, error: "Group not found!" }
            const password = await this.prisma.password.update({
                where: {
                    id: passId,
                    groupId: groupId,
                    teamId: group.teamId
                },
                data: {
                    groupId: group.id
                }
            })
            if (!password) throw Error("Group or Password not found")
            return { success: true, password }
        } catch (error) {
            return { success: false, error: "Group or Password not found" }
        }
    }

    async test(input: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const process = exec(`python src/utils/py/model.py`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error executing Python script:', error);
                    reject(error);
                } else {
                    // console.log('Python script output:', stdout);
                    resolve({ success: true, output: stdout });
                }
            })
            process.stdin.write(input)
            process.stdin.end()
        });
    }

    async test2(input: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const process = exec(`python src/utils/py/model2.py`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error executing Python script:', error);
                    reject(error);
                } else {
                    // console.log('Python script output:', stdout);
                    resolve({ success: true, output: parseFloat(stdout.trim()) });
                }
            })
            process.stdin.write(input)
            process.stdin.end()
        });
    }
}