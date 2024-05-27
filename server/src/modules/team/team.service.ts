import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma" 
import { CreateTeamDto } from "./dto/create.input.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { Team, User } from "@prisma/client";

@Injectable()
export class TeamService {
    constructor(
        private readonly prisma: PrismaService, 
        private readonly mailService: MailerService
    ){}

    async createTeam(payload: CreateTeamDto, userId: string):Promise<any>{
        if(!userId) return {success:false, error:"User not found"};
        try {
            const team = await this.prisma.team.create({
                data:{
                    name: payload.name,
                    userId: userId,
                }
            })
            const user = await this.prisma.user.findFirst({
                where:{
                    id:userId
                }
            })
            const userTeam = await this.prisma.userTeam.create({
                data:{
                    userId,
                    teamId:team.id,
                    invited:false,
                    accepted:true
                }
            })
            const group = await this.prisma.group.create({
                data:{
                    name:`General`,
                    teamId:team.id,
                    userId:userId,
                    default:true
                }
            })
            if(payload.members && payload.members.length>0){    
                const members = await this.prisma.userTeam.createMany({
                    data:payload.members.map((userId)=>({
                        teamId:team.id,
                        userId:userId,
                        invited:true,
                        accepted:false
                    }))
                })
                payload.members.forEach((member)=>{
                    this.sendTeamInviteMail(user, member, team)
                })
            }
            return {success:true, team, group:{...group, team}};
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
                userTeam: {
                    some: {
                        userId:userId,
                        accepted:true
                    }
                }
            },
            select:{
                id:true,
                name:true,
                personal:true,
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
                userTeam: {
                    some: {
                        userId:userId,
                        accepted:true
                    }
                }
            },
            select:{
                id:true,
                name:true,
                personal:true,
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
                userTeam: {
                    some: {
                        userId:userId,
                        accepted:false,
                        invited:true
                    }
                }
            },
            select:{
                id:true,
                name:true,
                personal:true,
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
                personal:true,
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
                userId:userId,
                personal:false
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

    async getAllPass(userId: string, teamId: string){
        const passwords = await this.prisma.password.findMany({
            where:{
                teamId,
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

    async getAllGroups(userId:string, teamId:string){
        const groups = await this.prisma.group.findMany({
            where:{
                teamId,
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

    async getAllUsers(userId:string, teamId:string){
        const users = await this.prisma.user.findMany({
            where:{
                userTeam:{
                    some:{
                        teamId,
                        userId
                    }
                }
            },
            select:{
                id:true,
                email:true,
                username:true,
            }
        })
        return {users, success:true}
    }

    async sendTeamInviteMail(from: User, toId:string, team:Team) {
        try {
            const to = await this.prisma.user.findFirst({
                where:{
                    id:toId
                }
            })
            await this.mailService.sendMail({
            from: `${from.username} <${from.email}>`,
            to: to.email,
            subject: `${from.username} is inviting you to ${team.name}`,
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Join Our Password Team</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 50px auto;
                        background-color: #ffffff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .header {
                        background-color: #007bff;
                        color: #ffffff;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content p {
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    .content .team-name {
                        font-weight: bold;
                        color: #007bff;
                    }
                    .footer {
                        background-color: #f4f4f4;
                        padding: 10px;
                        text-align: center;
                        font-size: 14px;
                        color: #666666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Join Our Password Team <b>${team.name}</b></h1>
                    </div>
                    <div class="content">
                        <p>Hello, <b>${to.username}</b></p>
                        <p>You've been invited to join the password team from <span class="team-name">${team.name}</span>. By joining, you will get access to all the passwords and groups that belong to this <span class="team-name">${team.name}</span> team.</p>
                        <p>Click the link below to join now:</p>
                        <p><a href="https://v-pass.vercel.app/teams/invites" target="_blank">Join Now</a></p>
                        <p>Thank you,</p>
                        <p>The <span class="team-name">${team.name}</span> Team</p>
                    </div>
                    <div class="footer">
                        &copy; 2024 <span class="team-name">vPass</span>. All rights reserved.
                    </div>
                </div>
            </body>
            </html>            
            `
            });      
        } catch (error) {
           console.log(error)     
        }
    }
}