import * as fcl from "@onflow/fcl";
    async function mintNFT(type, url) {
      try {
        const res = await fcl.mutate({
          cadence: `
              import FlowTutorialMint from 0xf8d6e0586b0a20c7
              import NonFungibleToken from 0xf8d6e0586b0a20c7
              import MetadataViews from 0xf8d6e0586b0a20c7
  
              transaction(type: String, url: String){
                  let recipientCollection: &FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic}
  
                  prepare(signer: AuthAccount){
                      
                  if signer.borrow<&FlowTutorialMint.Collection>(from: FlowTutorialMint.CollectionStoragePath) == nil {
                  signer.save(<- FlowTutorialMint.createEmptyCollection(), to: FlowTutorialMint.CollectionStoragePath)
                  signer.link<&FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(FlowTutorialMint.CollectionPublicPath, target: FlowTutorialMint.CollectionStoragePath)
                  }
  
                  self.recipientCollection = signer.getCapability(FlowTutorialMint.CollectionPublicPath)
                                              .borrow<&FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic}>()!
                  }
                  execute{
                      FlowTutorialMint.mintNFT(recipient: self.recipientCollection, type: type, url: url)
                  }
              }
              `,
          args: (arg, t) => [arg(type, t.String), arg(url, t.String)],
          limit: 9999,
        });
        fcl.tx(res).subscribe((res) => {
          if (res.status === 4 && res.errorMessage === "") {
              window.alert("NFT Minted!")
              window.location.reload(false);
          }
        });
  
        console.log("txid", res);
      } catch (error) {
        console.log("err", error);
      }
    }

    export default mintNFT