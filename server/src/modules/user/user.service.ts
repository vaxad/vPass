import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma" 
import { SignupInputDto } from "./dto/signup.input.dto";
import { hashPassword, verifyPassword } from "src/utils/hashPassword";
import { JwtService } from "@nestjs/jwt"
import { MailerService } from "@nestjs-modules/mailer";
import { generateOTP } from "src/utils/functions";


@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailerService
    ){}

    async createUser(payload: SignupInputDto):Promise<any>{
        try {
            const {hash, salt} = hashPassword(payload.password);
            const otp = generateOTP(6);
            const user = await this.prisma.user.create({
                data:{
                    ...payload,
                    password: hash,
                    salt,
                    otp,
                    otpCreatedAt: new Date(Date.now())
                }
            });
            const token = this.jwtService.sign({userId: user.id}, {
                expiresIn: "1d",
                secret: process.env.JWT_SECRET
            });
            this.sendOTPMail(user.id)
            const team = await this.prisma.team.create({
                data:{
                    name:`${user.username}'s Personal Team`,
                    userId:user.id,
                    personal:true,
                }
            })
            const userTeam = await this.prisma.userTeam.create({
                data:{
                    userId:user.id,
                    teamId:team.id,
                    invited: false,
                    accepted: true,
                }
            })
            const group = await this.prisma.group.create({
                data:{
                    name:"General",
                    default:true,
                    teamId:team.id,
                    userId:user.id
                }
            })
            return {token, success:true};
        } catch (error) {
            console.log({error})
            return {success:false, error}
        }
    }

    async getUser(userId:string):Promise<any>{
        if(!userId) return null
        const user = await this.prisma.user.findFirst({
            where:{
                id:userId
            },
            select:{
                id:true,
                username:true,
                email:true,
                createdAt: true,
                _count:{
                    select:{
                        groups:true,
                        teams:true,
                        userTeam:true
                    }
                }
            }
        })
        return user
    }

    async getMe(userId:string):Promise<any>{
        // console.log({userId})
        if(!userId) return {success: false, error: "User not found"}
        const user = await this.prisma.user.findFirst({
            where:{
                id:userId
            },
            select:{
                id:true,
                username:true,
                email:true,
                createdAt: true,
                verified:true,
                groups:{
                    select:{
                        id:true,
                        name:true,
                        createdAt:true
                    }
                },
                userTeam:{
                    where:{
                        accepted:true
                    },
                    select:{
                        id:true,
                        team:{
                            select:{
                                id:true,
                                name:true,
                                groups:{
                                    select:{
                                        id:true,
                                        name:true,
                                        createdAt:true
                                    }
                                }
                            }

                        }
                    }
                }
            }
        })
        return { success: true, user}
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
                    personal:false
                }
            })
            if(!team)return {success:false, error:'Cannot invite others to personal teams!'}
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

    async resendOTP(userId:string){
        try {
            const otp = generateOTP(6);
            const user = await this.prisma.user.update({
                where:{
                    id:userId,
                    verified:false
                },
                data:{
                    otp,
                    otpCreatedAt: new Date(Date.now())
                }
            })
            this.sendOTPMail(user.id)
            return {success:true}
        } catch (error) {
            return {success:false, error:"User not found!"}
        }
    }

    async sendOTPMail(userId: string) {
        try {
            const user = await this.prisma.user.findFirst({
                where:{
                    id:userId
                }
            })
            if(user)
            await this.mailService.sendMail({
            from: 'Team vPass <prabhuvrd@gmail.com>',
            to: user.email,
            subject: `OTP for validation`,
            html: `
                <p>Dear ${user.username},</p>
                <p>Welcome to vPass, your trusted password manager! We're excited to have you onboard and help you secure your digital life effortlessly.</p>
                <p>To complete your registration and start using vPass, please use the following OTP (One-Time Password):</p>
                <p><strong>OTP: ${user.otp}</strong></p>
                <p>Please enter this OTP within the vPass app to verify your email address and complete the onboarding process. This OTP will only be valid for the next 10 minutes</p>
                <p>If you have any questions or need assistance, don't hesitate to reach out to our support team at <a href="mailto:prabhuvrd@gmail.com">prabhuvrd@gmail.com</a>. We're here to help!</p>
                <p>Best regards,</p>
                <p>Varad Prabhu<br/>vPass Team</p>
            `
            });      
        } catch (error) {
           console.log(error)     
        }
    }

    async verifyUser(userId:string, otp: string){
        const user = await this.prisma.user.findFirst({
            where:{
                id:userId
            }
        })
        if(!user) return {success: false, error:"User not found!"}
        const verified = user.otp && user.otp === otp && ((new Date(user.otpCreatedAt)).getTime()+(10*60*1000)) > Date.now()
        if(!verified) return {success: false, error:"Invalid OTP"}
        const update = await this.prisma.user.update({
            where:{
                id:userId
            },
            data:{
                verified:true
            }
        })
        return {success: true, verified}

    }
    
}