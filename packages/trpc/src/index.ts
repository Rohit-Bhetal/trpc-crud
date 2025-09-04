import {initTRPC} from '@trpc/server';
import type { OpenApiMeta } from 'trpc-to-openapi';
import { success, unknown, z} from "zod";



const t = initTRPC.meta<OpenApiMeta>().create();
const userSchema = z.object({
    id:z.number(),
    name:z.string(),
    age:z.number(),
    createdAt:z.string().datetime()
});



type User= z.infer<typeof userSchema>
let users:User[] = [];
export const appRouter = t.router({
    //Check server Working
    hello:t.procedure.meta(
        {
            openapi:{
                method:'GET',
                path:'/hello',
                summary:'Check the Server'
            }
        }
    ).input(z.object({name:z.string()})).output(z.object({message:z.string()})).query(({input})=>{
        return {message:`Hello ${input.name}`}
    }),
    // Fetch user 
    getUsers: t.procedure.meta(
        {
            openapi:{
                method:'GET',
                path:'/users',
                summary:'Fetch all users'
            }
            
        }
    ).input(z.void()).output(z.array(userSchema)).query(()=>users),

    // Fetch user by name
    getUser:t.procedure.meta(
        {   
            openapi:{
                method:'GET',
                path:'/users/{id}',
                summary:'Fetch specific users'
            }
            
        }
    ).input(z.object({id:z.number()})).output(userSchema.nullable()).query(({input})=>{
        return users.find((u)=>u.id===input.id)??null
    }),

    //Add user 
    createUser:t.procedure.meta(
        {
            openapi:{
                method:'POST',
                path:'/users',
                summary:'Add new Users'
            }
            
        }
    ).input(z.object({name:z.string(),age:z.number()})).output(userSchema).mutation(({input})=>{
        const newUser:User = {...input,createdAt:new Date().toISOString(),id:Date.now()};
        users.push(newUser);
        return newUser
    }),

    // Update user
    updateUser: t.procedure.meta(
        {
            openapi:{
                method:'PUT',
                path:'/users/{id}',
                summary:'Update a Users'
            }
            
        }
    ).input(z.object({id:z.number(),name:z.string(),age:z.number()})).output(userSchema).mutation(({input})=>{
        const index = users.findIndex((u)=>u.id===input.id);
        if (index===-1) throw new Error("User not Found")
        users[index] = {...input,createdAt:new Date().toISOString()}
        return users[index]
    }),

    // deleteUser
    deleteUser: t.procedure.meta(
        {
            openapi:{
                method:'DELETE',
                path:'/users/{id}',
                summary:'Update a Users'
            }
            
        }
    ).input(z.object({id:z.number()})).output(z.object({success:z.boolean()})).mutation(({input})=>{
        users = users.filter((u)=>u.id !== input.id)
        return {success:true}

    })

})


export type AppRouter = typeof appRouter;