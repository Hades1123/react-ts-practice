import { DetailBook } from "@/components/clients/books/detail.book"
import { useEffect } from "react";
import { useParams } from "react-router-dom";


const BookPage = () => {
    let { id } = useParams();

    useEffect(() => {
        if (id) {
            //do something
            console.log("book id = ", id)
        }
    }, [id])

    return (
        <>
            <DetailBook />
        </>
    )
}

export default BookPage