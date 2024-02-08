pub contract User {
  pub let publicPath: PublicPath
  pub let privatePath: StoragePath
  pub resource interface Public {
    pub fun getName(): String
    pub fun getEmail(): String  
    pub fun getInfo(): String
    pub fun asReadOnly(): User.ReadOnly
  }
  
  pub resource interface Owner {
     pub fun getName(): String
    pub fun getEmail(): String
    pub fun getInfo(): String
    
    pub fun setName(_ name: String) {
      pre {
        name.length <= 15: "Names must be under 15 characters long."
      }
    }
    pub fun setEmail(_ src: String)
 
    pub fun setInfo(_ info: String) {
      pre {
        info.length <= 280: "Profile Info can at max be 280 characters long."
      }
    }
  }
  
  pub resource Base: Owner, Public {
    access(self) var name: String
    access(self) var email: String
   
    access(self) var info: String
    
    init() {
      self.name = "Anon"
      self.email = ""
      self.info = ""
    }
    
    pub fun getName(): String { return self.name }
    pub fun getEmail(): String { return self.email }
    pub fun getInfo(): String { return self.info }   
    pub fun setName(_ name: String) { self.name = name }
    pub fun setEmail(_ src: String) { self.email = src }
    pub fun setInfo(_ info: String) { self.info = info }
    pub fun asReadOnly(): User.ReadOnly {
      return User.ReadOnly(
        address: self.owner?.address,
        name: self.getName(),
        avatar: self.getEmail(),
        info: self.getInfo()
      )
    }
  }

  pub struct ReadOnly {
    pub let address: Address?
    pub let name: String
    pub let email: String   
    pub let info: String
    
    init(address: Address?, name: String, email: String, info: String) {
      self.address = address
      self.name = name
      self.email = email   
      self.info = info
    }
  }
  
  pub fun new(): @User.Base {
    return <- create Base()
  }
  
  pub fun check(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&{User.Public}>(User.publicPath)
      .check()
  }
  
  pub fun fetch(_ address: Address): &{User.Public} {
    return getAccount(address)
      .getCapability<&{User.Public}>(User.publicPath)
      .borrow()!
  }
  
  pub fun read(_ address: Address): User.ReadOnly? {
    if let user = getAccount(address).getCapability<&{User.Public}>(User.publicPath).borrow() {
      return user.asReadOnly()
    } else {
      return nil
    }
  }
  
  pub fun readMultiple(_ addresses: [Address]): {Address: User.ReadOnly} {
    let users: {Address: User.ReadOnly} = {}
    for address in addresses {
      let user = User.read(address)
      if user != nil {
        users[address] = user!
      }
    }
    return users
  }

    
  init() {
    self.publicPath = /public/profile
    self.privatePath = /storage/profile
    
    self.account.save(<- self.new(), to: self.privatePath)
    self.account.link<&Base{Public}>(self.publicPath, target: self.privatePath)
    
    self.account
      .borrow<&Base{Owner}>(from: self.privatePath)!
      .setName("qvvg")
  }
}