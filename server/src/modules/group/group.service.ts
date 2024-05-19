import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma" 
import { CreateGroupDto } from "./dto/create.input.dto";

@Injectable()
export class GroupService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    async createGroup(name: string, userId: string, teamId?:string):Promise<any>{
        if(!userId) return {success:false, error:"User not found"};
        try {
            const team = teamId?
            await this.prisma.team.findFirst({
                where:{
                    id:teamId,
                    userTeam:{
                        some:{
                            userId,
                            accepted:true
                        }
                    }
                }
            }):
            await this.prisma.team.findFirst({
                where:{
                    userId,
                    personal:true
                }
            })
            if(!team)return  {success:false, error: "Team not found!"}
            const group = await this.prisma.group.create({
                data:{
                    name: name,
                    userId: userId,
                    default:false,
                    teamId:team.id
                },
                select:{
                    id:true,
                    name:true,
                    createdAt:true,
                    user:{
                        select:{
                            id:true,
                            email:true,
                            username:true
                        }
                    },
                    passwords:{
                        select:{
                            name:true,
                            user:{
                                select:{
                                    id:true,
                                    email:true,
                                    username:true
                                }
                            },
                            createdAt:true,
                            id:true
                        }
                    },
                    team:{
                        select:{
                            name:true,
                            id:true
                        }
                    },
                    _count:{
                        select:{
                            passwords:true
                        }
                    }
                }
            })
            return {success:true, group};
        } catch (error) {
            console.log({error})
            return {success:false, error}
        }
    }

    async getGroup(userId:string, groupId:string):Promise<any>{
        if(!userId||!groupId) return {success:false, error:"User not found"};
        const group = await this.prisma.group.findFirst({
            where:{
                id:groupId,
                team:{
                    userTeam:{
                        some:{
                            userId,
                            accepted:true
                        }
                    }
                }
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                user:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                passwords:{
                    select:{
                        name:true,
                        user:{
                            select:{
                                id:true,
                                email:true,
                                username:true
                            }
                        },
                        createdAt:true,
                        id:true
                    }
                },
                team:{
                    select:{
                        name:true,
                        id:true
                    }
                },
                _count:{
                    select:{
                        passwords:true
                    }
                }
            }
        })
        if(!group) return {success:false, error:"Group not found"}
        return {success:true, group}
    }

    async getAll(userId:string){
        const groups = await this.prisma.group.findMany({
            where:{
                team:{
                    userTeam:{
                        some:{
                            userId,
                            accepted:true
                        }
                    }
                }
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                user:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                passwords:{
                    select:{
                        name:true,
                        user:{
                            select:{
                                id:true,
                                email:true,
                                username:true
                            }
                        },
                        createdAt:true,
                        id:true
                    }
                },
                team:{
                    select:{
                        id: true,
                        name: true
                    }
                },
                _count:{
                    select:{
                        passwords:true
                    }
                }
            }
        })
        return {groups, success:true}
    }

    async editGroup(payload: CreateGroupDto, userId: string, groupId:string):Promise<any>{
        if(!userId||!groupId) return {success:false, error:"Group not found"};
        const group = await this.prisma.group.findUnique({
            where:{
                id:groupId,
                team:{
                    userTeam:{
                        some:{
                            userId,
                            accepted:true
                        }
                    }
                }
            }
        })
        if(!group) return {success:false, error:"Group not found"};
        const updatedGroupData = await this.prisma.group.update({
            where:{
                id:groupId,
                userId:userId
            },
            data:{
                name: payload.name,
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                user:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                },
                passwords:{
                    select:{
                        name:true,
                        user:{
                            select:{
                                id:true,
                                email:true,
                                username:true
                            }
                        },
                        createdAt:true,
                        id:true
                    }
                },
                _count:{
                    select:{
                        passwords:true
                    }
                }
            }
        })
        return {success:true, group:updatedGroupData}
    }

    async deleteGroup(userId: string, groupId:string):Promise<any>{
        if(!userId||!groupId) return {success:false, error:"Group not found"};
        const group = await this.prisma.group.findUnique({
            where:{
                id:groupId,
                userId:userId,
                default:false
            }
        })
        if(!group) return {success:false, error:"Group not found"};
        const deletedGroupData = await this.prisma.group.delete({
            where:{
                id:groupId,
                userId:userId
            }
        })
        return {success:true, group:deletedGroupData}
    }

    async addToTeam(userId: string, groupId: string, teamId: string):Promise<any>{
        if(!userId||!groupId||!teamId)return {sucess:false, error:"Not found!"}

        try {
            const team = await this.prisma.team.findFirst({
                where:{
                    id:teamId,
                    userTeam:{
                        some:{
                            userId:userId,
                            accepted:true
                        }
                    }
                }
            })
            if(!team) return {success:false, error:"Team not found!"};

            const group = await this.prisma.group.update({
                where:{
                    id: groupId,
                    userId: userId
                },
                data:{
                    teamId:teamId
                }
            })
            if(group)
            return {success: true, group} 
            return {success: false, error:"Group not found"}
        } catch (error) {
            return {success:false, error}
        }
    }

    async subFromTeam(userId: string, groupId: string, teamId: string):Promise<any>{
        if(!userId||!groupId||!teamId)return {sucess:false, error:"Not found!"}

        try {

            const ogGroup = await this.prisma.group.findFirst({
                where:{
                    id: groupId,
                    teamId: teamId,
                    team:{
                        userTeam:{
                            some:{
                                userId
                            }
                        }
                    }
                }
            })
            if(!ogGroup)return {sucess:false, error:"Group not found!"}
            const team = await this.prisma.team.findFirst({
                where:{
                    userId:ogGroup.userId,
                    personal:true
                }
            })
            if(!team)return {sucess:false, error:"Team not found!"}
            const group = await this.prisma.group.update({
                where:{
                    id: groupId,
                },
                data:{
                    teamId: team.id
                }
            })
            if(group)
            return {success: true, group} 
            return {success: false, error:"Group not found"}
        } catch (error) {
            return {success:false, error}
        }
    }

    async getAllPass(userId: string, groupId: string){
        const passwords = await this.prisma.password.findMany({
            where:{
                groupId,
                team:{
                    userTeam:{
                        some:{
                            userId
                        }
                    }
                }
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
        return {success:true, passwords}
    }
    
}