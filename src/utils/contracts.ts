import { ethers } from "ethers";
import tornadoJSON from "../json/Tornado.json";

export const tornadoAddress = "0x4663086ed4A490Ea0f3bb1787E38AFFC417c5397"
export const tornadoInterface = new ethers.utils.Interface(tornadoJSON);