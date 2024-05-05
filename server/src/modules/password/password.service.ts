import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma" 
import { CreatePasswordDto } from "./dto/create.input.dto";
import { JwtService } from "@nestjs/jwt"
import { decrypt, encrypt } from "src/utils/cipher.utils";
import { EditPasswordDto } from "./dto/edit.input.dto";
@Injectable()
export class PasswordService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    async createPassword(payload: CreatePasswordDto, userId: string):Promise<any>{
        if(!userId) return {success:false, error:"User not found"};
        try {
            const {encrypted, iv, key} = encrypt(payload.password);
            const password = await this.prisma.password.create({
                data:{
                    name: payload.name,
                    encrypted,
                    iv,
                    key,
                    userId: userId,
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
        const passwordData = await this.prisma.password.findUnique({
            where:{
                id:passId,
                userId:userId
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
                encrypted:true,
                iv:true,
                key:true,
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
        const password = decrypt(passwordData.encrypted, passwordData.key, passwordData.iv)
        const { encrypted, key, iv, ...dataToSend } = passwordData;
        return {success:true, password:{...dataToSend, password}}
    }

    async getAll(userId:string){
        const passwords = await this.prisma.password.findMany({
            where:{
                userId
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
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
        const {encrypted, iv, key } = payload.password?encrypt(payload.password):{encrypted:passwordData.encrypted, iv:passwordData.iv, key:passwordData.key};
        const updatedPasswordData = await this.prisma.password.update({
            where:{
                id:passId,
                userId:userId
            },
            data:{
                name: payload.name?payload.name:passwordData.name,
                encrypted,
                iv,
                key,
                teamId: payload.teamId?payload.teamId:passwordData.teamId,
                groupId: payload.groupId?payload.groupId:passwordData.groupId,
                
            },
            select:{
                id:true,
                name:true,
                createdAt:true,
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
}