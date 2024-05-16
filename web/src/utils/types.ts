export type SignupData = {
    username: string,
    email: string,
    password: string,
    cpassword: string,
}

export type LoginData = {
    email: string,
    password: string,
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
    passwords: Password[]
    groups: Group[]
    userTeam: UserTeam[]
    teams: Team[]
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
    user:      User     
    groupId?:   string,
    group?:      Group  
    teamId?:    string,
    team?:      Team   
}

export type Group = {
    id:        string      
    name:      string,
    createdAt: Date,    
    userId:   string,
    user:      User        
    passwords: Password[]
    teamId?: string,
    team?:      Team      
}

export type Team = {
    id:        string       
    name:      string,
    createdAt: Date,   
    userId:   string,
    creator:     User       
    passwords: Password[]
    groups: Group[]
    userTeam: UserTeam[]
}


export type UserTeam = {
    id:        string       
    userId:    string,
    teamId:    string,
    invited:   boolean      
    accepted:  boolean      
    user:      User         
    team:      Team         
    createdAt: Date    
}