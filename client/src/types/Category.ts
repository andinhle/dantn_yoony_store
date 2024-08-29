export type Category = {
    id:string
    name : string 
    slug : string
    image : string
    isShow : boolean
}
export type CategotyInputs = Omit <Category,`id`>