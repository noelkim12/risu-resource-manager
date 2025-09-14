import type { alertData } from "$lib/utils/alert";
import { get, writable, type Writable } from "svelte/store";
import type {
	Character,
	SimpleCharacterArgument,
} from "../../types/risu/character/character.types";
import type { GroupChat } from "../../types/risu/system/chatting.types";

function updateSize() {
	SizeStore.set({
		w: window.innerWidth,
		h: window.innerHeight,
	});
	DynamicGUI.set(window.innerWidth <= 1024);
}

export const SizeStore = writable({
	w: 0,
	h: 0,
});

const t = "https://raw.githubusercontent.com/ProjectAliceDev/ProjectAliceDev.github.io/master/";
export const loadedStore = writable(false);
export const DynamicGUI = writable(false);
export const sideBarClosing = writable(false);
export const sideBarStore = writable(window.innerWidth > 1024);
export const selectedCharID = writable(-1);
export const CharEmotion = writable({} as { [key: string]: [string, string, number][] });
export const ViewBoxsize = writable({ width: 12 * 16, height: 12 * 16 }); // Default width and height in pixels
export const settingsOpen = writable(false);
export const botMakerMode = writable(false);
export const moduleBackgroundEmbedding = writable("");
export const openPresetList = writable(false);
export const openPersonaList = writable(false);
export const MobileGUI = writable(false);
export const MobileGUIStack = writable(0);
export const MobileSideBar = writable(0);
export const ShowVN = writable(false);
export const SettingsMenuIndex = writable(-1);
export const ReloadGUIPointer = writable(0);
export const ReloadChatPointer = writable({} as Record<number, number>);
export const OpenRealmStore = writable(false);
export const ShowRealmFrameStore = writable("");
export const PlaygroundStore = writable(0);
export const HideIconStore = writable(false);
export const CustomCSSStore = writable("");
export const SafeModeStore = writable(false);
export const MobileSearch = writable("");
export const CharConfigSubMenu = writable(0);
export const CustomGUISettingMenuStore = writable(false);
export const alertStore = writable({
	type: "none",
	msg: "n",
} as alertData);
export const hypaV3ModalOpen = writable(false);
export const hypaV3ProgressStore = writable({
	open: false,
	miniMsg: "",
	msg: "",
	subMsg: "",
});
export const selIdState = $state({
	selId: -1,
});

CustomCSSStore.subscribe((css) => {
	console.log(css);
	const q = document.querySelector("#customcss");
	if (q) {
		q.innerHTML = css;
	} else {
		const s = document.createElement("style");
		s.id = "customcss";
		s.innerHTML = css;
		document.body.appendChild(s);
	}
});

export function createSimpleCharacter(char: Character | GroupChat) {
	if (!char || char.type === "group") {
		return null;
	}

	const simpleChar: SimpleCharacterArgument = {
		type: "simple",
		customscript: char.customscript,
		chaId: char.chaId,
		additionalAssets: char.additionalAssets,
		virtualscript: char.virtualscript,
		emotionImages: char.emotionImages,
		triggerscript: char.triggerscript,
	};

	return simpleChar;
}

updateSize();
window.addEventListener("resize", updateSize);

export const LoadingStatusState = $state({
	text: "",
});

export const QuickSettings = $state({
	open: false,
	index: 0,
});

export const disableHighlight = writable(true);
