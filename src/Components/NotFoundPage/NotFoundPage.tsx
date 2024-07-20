import { faBan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './NotFoundPage.css'

export const NotFoundPage:any = () =>{
    return(
        <div className="notFound">
            <h3 className="text-danger icontNotFound text-center"><FontAwesomeIcon icon={faBan}/></h3>
            <h3 className="text-danger text-center">404 Page Not Found</h3>
        </div>
    )
}