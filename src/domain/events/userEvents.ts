class UserEmailUpdated {
    constructor(public id: number, public email: string) {}
  }
  
  class UserPasswordUpdated {
    constructor(public id: number, public password: string) {}
  }
  
  class UserBanned {
    constructor(public id: number) {}
  }
  
  class UserUnbanned {
    constructor(public id: number) {}
  }
  
  export { UserEmailUpdated, UserPasswordUpdated, UserBanned, UserUnbanned };