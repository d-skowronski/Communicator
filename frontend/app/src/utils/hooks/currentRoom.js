import { useParams } from "react-router-dom";
import { useQueryAllRooms } from "./queries";

export default function useCurrentRoom() {
    let roomObj
    const {room:roomParam} = useParams()
    const roomsQuery = useQueryAllRooms()
    if (roomsQuery.isSuccess) {
        if(roomParam){
            roomObj = roomsQuery.data.results.find(room => room.id === Number(roomParam))
        }
        if(roomObj === undefined){
            return null
        }
    }
    return roomObj
}

