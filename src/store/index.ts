import ImageModel from "@/pages/home/image-model";
import { defineStore } from "pinia";

interface IManageStrore {
    selectModel:ImageModel,
    modelsManage:{img:ImageModel, name:string, id:number, price:string}[]
}

export const useManageStore= defineStore<string, IManageStrore>(
    "manage",
    {
        state: () => ({
            modelsManage: [],
            selectModel: null
        })
    }
)