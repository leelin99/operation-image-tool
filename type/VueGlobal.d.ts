import * as THREE from "three"
export{}
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        scene:THREE.Scene
        THREE:typeof THREE,
        animations:Function[]
    }
}