import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma" 
import { SignupInputDto } from "./dto/signup.input.dto";
import { hashPassword, verifyPassword } from "src/utils/hashPassword";
import { JwtService } from "@nestjs/jwt"
import { User } from "@prisma/client";
@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ){}

    async createUser(payload: SignupInputDto):Promise<any>{
        try {
            const {hash, salt} = hashPassword(payload.password);
            const user = await this.prisma.user.create({
                data:{
                    ...payload,
                    password: hash,
                    salt
                }
            });
            const token = this.jwtService.sign({userId: user.id}, {
                expiresIn: "1d",
                secret: process.env.JWT_SECRET
            });
            return {token, success:true};
        } catch (error) {
            console.log({error})
            return {success:false, error}
        }
    }

    async getUser(userId:string):Promise<any>{
        if(!userId) return null
        const user = await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        return {...user, password:"*******", salt:"*******"}
    }

    async getAll(){
        const users = await this.prisma.user.findMany({
            select:{
                id:true,
                email:true,
                username:true,
            }
        })
        return {users, success:true}
    }

    async login(email:string, password:string){
        const user = await this.prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user) return {success:false, error:"User not found"};
        const verified = verifyPassword({candidatePassword:password, hash:user.password, salt:user.salt});
        if(!verified) return {success:false, error:"Invalid password"};
        const token = this.jwtService.sign({userId: user.id}, {
            expiresIn: "1d",
            secret: process.env.JWT_SECRET
        });
        return {token, success:true};
    }

    async reqJoinTeam(teamId:string, userId:string, joineeId:string){
        if(!teamId||!userId||!joineeId)return {success:false, error:"Team or User not found"}
        
        try {
            const team = await this.prisma.team.findFirst({
                where:{
                    id:teamId,
                    OR:[
                        { userId: userId },
                        {
                            userTeam:{
                                some:{
                                    userId:userId,
                                    accepted:true
                                }
                            }
                        }
                    ]
                }
            })
            if(!team)throw Error("Team or User not found")
            const userTeam = await this.prisma.userTeam.create({
                data:{
                    userId:joineeId,
                    teamId,
                    accepted:false,
                    invited:true,
                },
                select:{
                    user:{
                        select:{
                            email:true,
                            id:true,
                            username:true
                        }
                    },
                    team:{
                        select:{
                            name:true,
                            id:true
                        }
                    }
                }
            })
            if(!userTeam) throw Error("Team or User not found")
            return {success:true, userTeam}
        } catch (error) {
            return {success:false, error:"Team or User not found"}
        }
    }

    async joinTeam(teamId:string, userId:string){
        if(!teamId||!userId)return {success:false, error:"Team or User not found"}
        try {
            const userTeam = await this.prisma.userTeam.update({
                where:{
                    userId_teamId:{
                        userId:userId,
                        teamId:teamId
                    },
                    invited:true,
                },
                data:{
                    accepted:true,
                    invited:false,
                },
                select:{
                    user:{
                        select:{
                            email:true,
                            id:true,
                            username:true
                        }
                    },
                    team:{
                        select:{
                            name:true,
                            id:true
                        }
                    }
                }
            })
            if(!userTeam) throw Error("Team or User not found")
            return {success:true, userTeam}
        } catch (error) {
            return {success:false, error:"Team or User not found"}
        }
    }

    
    async rejectTeam(teamId:string, userId:string){
        if(!teamId||!userId)return {success:false, error:"Team or User not found"}
        try {
            const userTeam = await this.prisma.userTeam.update({
                where:{
                    userId_teamId:{
                        userId:userId,
                        teamId:teamId
                    },
                    invited:true,
                },
                data:{
                    accepted:false,
                    invited:false,
                },
                select:{
                    user:{
                        select:{
                            email:true,
                            id:true,
                            username:true
                        }
                    },
                    team:{
                        select:{
                            name:true,
                            id:true
                        }
                    }
                }
            })
            if(!userTeam) throw Error("Team or User not found")
            return {success:true, userTeam}
        } catch (error) {
            return {success:false, error:"Team or User not found"}
        }
    }
}