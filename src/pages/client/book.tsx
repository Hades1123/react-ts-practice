import { LoaderSkeleton } from "@/components/clients/books/book.loader";
import { DetailBook } from "@/components/clients/books/detail.book"
import { getBookWithIdAPI } from "@/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const BookPage = () => {
    // get id from url
    let { id } = useParams();
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
    const { notification } = App.useApp();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchBook = async (id: string) => {
        setIsLoading(true);
        const result = await getBookWithIdAPI(id);
        if (result && result.data) {
            setCurrentBook(result.data);
        }
        else {
            notification.error({
                message: 'Call API failed',
                description: JSON.stringify(result.message),
            })
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (id) {
            fetchBook(id);
        }
    }, [id])

    return (
        <>
            {isLoading ?
                <LoaderSkeleton />
                :
                <DetailBook
                    currentBook={currentBook}
                />
            }
        </>
    )
}

export default BookPage