import img from "../imgs/404.png"
import full from "../imgs/full-logo.png"
import { Link } from "react-router-dom"
const PageNotFound = () => {
    return(
            <section className="h-cover relative p-10 flex flex-col  items-center gap-20" >
                <img src={img} className="select-none w-72 aspect-square object-cover rounded" />
                <h1 className="font-gelasio text-4xl leading-7" >Page Not Found</h1>
                <p className="text-dark-grey text-xl" >The page you requested doesn't exist, please head back to <Link to="/" className="text-black underline" >Home page </Link> </p>
                <img  src={full} className="h-8 object-contain block mx-auto select-none" />
                
            </section>
    ) 
}
export default PageNotFound