import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma" 
import { CreatePasswordDto } from "./dto/create.input.dto";
import { encrypt } from "src/utils/cipher.utils";
import { EditPasswordDto } from "./dto/edit.input.dto";
@Injectable()
export class PasswordService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    async createPassword(payload: CreatePasswordDto, userId: string):Promise<any>{
        if(!userId) return {success:false, error:"User not found"};
        try {
            const {encrypted, iv} = encrypt(payload.password);
            const password = await this.prisma.password.create({
                data:{
                    name: payload.name,
                    encrypted,
                    iv,
                    userId: userId,
                },
                select:{
                    id:true,
                    name:true,
                    public:true,
                    views:true,
                    createdAt:true,
                    user:{
                        select:{
                            id:true,
                            email:true,
                            username:true
                        }
                    },
                    team:{
                        select:{
                            id:true,
                            name:true
                        }
                    },
                    group:{
                        select:{
                            id:true,
                            name:true
                        }
                    }
                }
            })
            return {success:true, password};
        } catch (error) {
            console.log({error})
            return {success:false, error}
        }
    }

    async getPassword(userId:string, passId:string):Promise<any>{
        if(!userId||!passId) return {success:false, error:"User not found"};
        const user = await this.prisma.user.findFirst({
            where:{
                id:userId
            },
            select:{
                userTeam:{
                    select:{
                        id:true,
                        teamId:true
                    }
                }
            }
        })
        if(!user) return {success:false, error:"User not found"};
        const passwordData = await this.prisma.password.findUnique({
            where:{
                id:passId,
                OR:[
                    {userId: userId},
                    {teamId: {in:user.userTeam.map((i)=>i.teamId)}}
                ]
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                encrypted:true,
                public:true,
                views:true,
                iv:true,
                user:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                team:{
                    select:{
                        id:true,
                        name:true
                    }
                },
                group:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        })
        if(!passwordData) return {success:false, error:"Password not found"}
        // const password = decrypt(passwordData.encrypted, passwordData.iv)
        return {success:true, password:passwordData}
    }

    async getPublicPassword(passId:string):Promise<any>{
        if(!passId) return {success:false, error:"Password not found"};
        const passwordData = await this.prisma.password.findUnique({
            where:{
                id:passId,
                public:true,
                views: {gt:0}
            },
            select:{
                id:true,
                name:true,
                createdAt:true,   
                public:true,
                views:true,
                encrypted:true,
                iv:true,
                user:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                team:{
                    select:{
                        id:true,
                        name:true
                    }
                },
                group:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        })
        if(!passwordData) return {success:false, error:"Password not found"}
        const editPassword = await this.prisma.password.update({
            where:{
                id:passwordData.id
            },
            data:{
                views:{decrement:1},
                public:passwordData.views>1
            }
        })
        return {success:true, password:passwordData}
    }

    async getAll(userId:string){
        const user = await this.prisma.user.findFirst({
            where:{
                id:userId
            },
            select:{
                userTeam:{
                    select:{
                        id:true,
                        teamId:true
                    }
                }
            }
        })
        if(!user) return {success:false, error:"User not found"};
        const passwords = await this.prisma.password.findMany({
            where:{
                OR:[
                    {userId: userId},
                    {teamId: {in:user.userTeam.map((i)=>i.teamId)}}
                ]
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                public:true,
                views:true,
                team:{
                    select:{
                        id:true,
                        name:true
                    }
                },
                user:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                group:{
                    select:{
                        id:true,
                        name:true
                    }
                }

            }
        })
        return {passwords, success:true}
    }

    async editPassword(payload: EditPasswordDto, userId: string, passId:string):Promise<any>{
        if(!userId||!passId) return {success:false, error:"Password not found"};
        const passwordData = await this.prisma.password.findUnique({
            where:{
                id:passId,
                userId:userId
            }
        })
        if(!passwordData) return {success:false, error:"Password not found"};
        const {encrypted, iv } = payload.password?encrypt(payload.password):{encrypted:passwordData.encrypted, iv:passwordData.iv};
        const updatedPasswordData = await this.prisma.password.update({
            where:{
                id:passId,
                userId:userId
            },
            data:{
                name: payload.name?payload.name:passwordData.name,
                encrypted,
                iv,
                teamId: payload.teamId?payload.teamId:passwordData.teamId,
                groupId: payload.groupId?payload.groupId:passwordData.groupId,
                public: payload.public?payload.public==="true":passwordData.public,
                views: payload.views?payload.views:passwordData.views
                
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                public:true,
                views:true,
                team:{
                    select:{
                        id:true,
                        name:true
                    }
                },
                user:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                group:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        })
        return {success:true, password:updatedPasswordData}
    }

    async deletePassword(userId: string, passId:string):Promise<any>{
        if(!userId||!passId) return {success:false, error:"Password not found"};
        const passwordData = await this.prisma.password.findUnique({
            where:{
                id:passId,
                userId:userId
            }
        })
        if(!passwordData) return {success:false, error:"Password not found"};
        const deletedPasswordData = await this.prisma.password.delete({
            where:{
                id:passId,
                userId:userId
            }
        })
        return {success:true, password:deletedPasswordData}
    }

    async addToTeam(teamId: string, passId:string, userId: string):Promise<any>{
        if(!teamId||!passId)return {success:false, error:"Team or Password not found"}
        try {
        const password = await this.prisma.password.update({
            where:{
                id:passId,
                userId:userId
            },
            data:{
                teamId:teamId
            }
        })
        if(!password)throw Error("Team or Password not found")
        return {success:true, password}
        } catch (error) {
            return {success:false, error:"Team or Password not found"}
        }
    }

    async subFromTeam(teamId: string, passId:string, userId: string):Promise<any>{
        if(!teamId||!passId)return {success:false, error:"Team or Password not found"}

        try {
        const password = await this.prisma.password.update({
            where:{
                id:passId,
                userId:userId
            },
            data:{
                teamId:null
            }
        })
        if(!password)throw Error("Team or Password not found")
        return {success:true, password}
        } catch (error) {
            return {success:false, error:"Team or Password not found"}
        }
    }

    
    async addToGroup(groupId: string, passId:string, userId: string):Promise<any>{
        if(!groupId||!passId)return {success:false, error:"Group or Password not found"}
        try {
        const password = await this.prisma.password.update({
            where:{
                id:passId,
                userId:userId
            },
            data:{
                groupId:groupId
            }
        })
        if(!password)throw Error("Group or Password not found")
        return {success:true, password}
        } catch (error) {
            return {success:false, error:"Group or Password not found"}
        }
    }

    async subFromGroup(groupId: string, passId:string, userId: string):Promise<any>{
        if(!groupId||!passId)return {success:false, error:"Group or Password not found"}
        try {
        const password = await this.prisma.password.update({
            where:{
                id:passId,
                userId:userId
            },
            data:{
                groupId:null
            }
        })
        if(!password)throw Error("Group or Password not found")
        return {success:true, password}
        } catch (error) {
            return {success:false, error:"Group or Password not found"}
        }
    }
}