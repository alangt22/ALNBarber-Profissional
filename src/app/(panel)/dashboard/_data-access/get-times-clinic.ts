"use server"

import prisma from "@/lib/prisma"

export async function getTimesClinic({userId}: {userId: string}) {
    if(!userId){
        return{
            times: [],
            userId: ""
        }
    }

    try {

        const user = await prisma.user.findFirst({
            where:{
                id: userId
            },
            select:{
                id: true,
                times: true,
                barber: true
            }
        })

        if(!user){
            return {
                times: [],
                userId: "",
                barber: ""
            }
        }

        return {
            times: user.times,
            userId: user.id,
            barber: user.barber
        }
        
    } catch (error) {
        console.log(error)
        return{
            times: [],
            userId: "",
            barber: ""
        }
    }
}