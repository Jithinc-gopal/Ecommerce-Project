 import axios from "axios"
async function WishList(product){
    const email = localStorage.getItem("email")
    console.log(product)
    try{
        if(!email){
            console.log("user email not found")
        }

    const res  = await axios.get(`http://localhost:3000/user?email=${email}`)
    const user = res.data[0]
    console.log(user)
  
    let updateWishList

    const exWishList = user.WishList || []
    const WishListitem = exWishList.find((item)=>item.id === product.id)
    console.log(`${product.title} added to wishlist`)

    if(WishListitem){
        updateWishList= exWishList.map(p=>p.id=== product.id?{...p,quantity:(p.quantity||1)+1}:p)

    }else{
       updateWishList=[...exWishList,{...product}]

    }
      await axios.patch(`http://localhost:3000/user/${user.id}`,{
    WishList:updateWishList
  })
  console.log("WishList updated succsfully")



    }
    catch(err){
        console.log("error occuerd ",err)
    }


}
export default WishList