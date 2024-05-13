import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma" 
import { CreateTeamDto } from "./dto/create.input.dto";

@Injectable()
export class TeamService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    async createTeam(payload: CreateTeamDto, userId: string):Promise<any>{
        if(!userId) return {success:false, error:"User not found"};
        try {
            const team = await this.prisma.team.create({
                data:{
                    name: payload.name,
                    userId: userId,
                },
                select:{
                    id:true,
                    name:true,
                    createdAt:true,
                    creator:{
                        select:{
                            id:true,
                            email:true,
                            username:true
                        }
                    },
                    _count:{
                        select:{
                            groups:true,
                            passwords:true,
                            userTeam:true
                        }
                    }
                    
                }
            })
            const userTeam = await this.prisma.userTeam.create({
                data:{
                    userId,
                    teamId:team.id
                }
            })
            return {success:true, team};
        } catch (error) {
            console.log({error})
            return {success:false, error}
        }
    }

    async getTeam(userId:string, teamId:string):Promise<any>{
        if(!userId||!teamId) return {success:false, error:"User not found"};
        const team = await this.prisma.team.findUnique({
            where:{
                id:teamId,
                OR:[
                    { userId: userId},
                    {
                        userTeam: {
                            some: {
                                userId:userId,
                                accepted:true
                            }
                        }
                    }
                ]
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                creator:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                groups:{
                    select:{
                        id:true,
                        name:true,
                        createdAt:true,
                        _count:{
                            select:{
                                passwords:true
                            }
                        }
                    }
                },
                _count:{
                    select:{
                        groups:true,
                        passwords:true,
                        userTeam:true
                    }
                }
            }
        })
        if(!team) return {success:false, error:"Team not found"}
        return {success:true, team}
    }

    async getAll(userId:string){
        const teams = await this.prisma.team.findMany({
            where:{
                OR:[
                { userId:userId },
                {
                    userTeam: {
                        some: {
                            userId:userId,
                            accepted:true
                        }
                    }
                }
                ]
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                creator:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                groups:{
                    select:{
                        id:true,
                        name:true,
                        createdAt:true,
                        _count:{
                            select:{
                                passwords:true
                            }
                        }
                    }
                },
                _count:{
                    select:{
                        groups:true,
                        passwords:true,
                        userTeam:true
                    }
                }
            }
        })
        return {teams, success:true}
    }

    async getAllRequests(userId:string){
        const teams = await this.prisma.team.findMany({
            where:{
                OR:[
                { userId:userId },
                {
                    userTeam: {
                        some: {
                            userId:userId,
                            accepted:false,
                            invited:true
                        }
                    }
                }
                ]
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                creator:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                groups:{
                    select:{
                        id:true,
                        name:true,
                        createdAt:true,
                        _count:{
                            select:{
                                passwords:true
                            }
                        }
                    }
                },
                _count:{
                    select:{
                        groups:true,
                        passwords:true,
                        userTeam:true
                    }
                }
            }
        })
        return {teams, success:true}
    }

    async editTeam(payload: CreateTeamDto, userId: string, teamId:string):Promise<any>{
        if(!userId||!teamId) return {success:false, error:"Team not found"};
        const team = await this.prisma.team.findUnique({
            where:{
                id:teamId,
                userId:userId
            }
        })
        if(!team) return {success:false, error:"Team not found"};
        const updatedTeamData = await this.prisma.team.update({
            where:{
                id:teamId,
                userId:userId
            },
            data:{
                name: payload.name,
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                creator:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                groups:{
                    select:{
                        id:true,
                        name:true,
                        createdAt:true,
                        _count:{
                            select:{
                                passwords:true
                            }
                        }
                    }
                },
                _count:{
                    select:{
                        groups:true,
                        passwords:true,
                        userTeam:true
                    }
                }
            }
        })
        return {success:true, team:updatedTeamData}
    }

    async deleteTeam(userId: string, teamId:string):Promise<any>{
        if(!userId||!teamId) return {success:false, error:"Team not found"};
        const team = await this.prisma.team.findUnique({
            where:{
                id:teamId,
                userId:userId
            }
        })
        if(!team) return {success:false, error:"Team not found"};
        const deletedTeamData = await this.prisma.team.delete({
            where:{
                id:teamId,
                userId:userId
            }
        })
        return {success:true, team:deletedTeamData}
    }



    
}