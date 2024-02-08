import User from 0xf8d6e0586b0a20c7
    




    transaction {
      let address: Address
      prepare(add:AuthAccount) {
        self.address = add
        if !User.check(self.address) {
          currentUser.save(<- User.new(), to: User.privatePath)
          currentUser.link<&User.Base{User.Public}>(User.publicPath, target: User.privatePath)
        }
      }
      post {
        User.check(self.address): "Account was not initialized"
      }
    }


    pub fun main(){

    }

    pub fun main(){
      
    }