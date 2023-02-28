import ImageModel from "@/pages/home/image-model";
import { defineStore } from "pinia";

interface IManageStrore {
    selectModel:ImageModel,
    modelsManage:ImageModel[]
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