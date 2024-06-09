export type SignupData = {
    username: string,
    email: string,
    password: string,
    cpassword: string,
}

export type DropdownItem = {
    name:string,
    value:string,
    onClickFn?: ()=>void
}

export type LoginData = {
    email: string,
    password: string,
}

export type CreatePasswordData = {
    name: string,
    groupId: string,
    password: string,
    teamId: string,
    public: string,
    views: string
}

export type CreateTeamData = {
    name: string,
    members:string[]
}

export type CreateGroupData = {
    name: string,
    teamId:string
}
  
export type User = {
    id:   string,
    username: string,
    email:    string,
    password: string,
    salt:     string,
    otp?:      string,
    otpCreatedAt: Date, 
    verified:  boolean, 
    createdAt: Date,
    passwords: Password[],
    groups: Group[],
    userTeam: UserTeam[],
    teams: Team[],
    _count: {
        passwords?: number
        groups?: number
        userTeam?: number
    }
}

export type Password = {
    id:        string   
    name:      string,
    encrypted: string,
    iv:      string,
    createdAt: Date, 
    userId:    string,
    public:    boolean,
    views:     number,      
    user:      User,     
    groupId:   string,
    group:      Group  
    teamId:    string,
    team:      Team,  
}

export type Group = {
    id:        string      
    name:      string,
    createdAt: Date,    
    user:      User,    
    default: boolean,   
    passwords: Password[],
    team:      Team,   
    _count: {
        passwords?: number
    }   

}

export type Team = {
    id:        string       
    name:      string,
    createdAt: Date,   
    userId:   string,
    personal: boolean,
    creator:     User,       
    passwords: Password[],
    groups: Group[],
    userTeam: UserTeam[],
    _count: {
        passwords?: number
        groups?: number
        userTeam?: number
    }
}


export type UserTeam = {
    id:        string       
    userId:    string,
    teamId:    string,
    invited:   boolean,     
    accepted:  boolean,     
    user:      User,         
    team:      Team,         
    createdAt: Date,    
}

export type ToastType = "NORMAL" | "WARNING" | "ERROR"
export type Toast = {
    message: string,
    type: ToastType
}

export const ToastBgColor:Record<ToastType, string> = {
    "ERROR":"red",
    "NORMAL":"white",
    "WARNING":"yellow"
}

export const ToastTextColor:Record<ToastType, string> = {
    "ERROR":"white",
    "NORMAL":"black",
    "WARNING":"black"
}