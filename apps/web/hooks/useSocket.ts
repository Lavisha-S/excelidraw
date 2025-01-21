import {useEffect,useState} from "react";
import {WS_URL} from "../app/config"


export function useSocket(){
    const [loading, setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>();

    useEffect(()=>{
    const ws= new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjOTVmOTQyYi02OWJhLTRjZDYtYTAyMS0xZjEwZTg0ODQ4MzIiLCJpYXQiOjE3MzczMDc2MjB9.w4a5Z_dQTmotCoi0NnlleCmTfCNk_FSdp00lSPurWGg`);
    ws.onopen=()=>{
        setLoading(false);
        setSocket(ws);
    }

},[]);
return{
    socket,
    loading
}
}