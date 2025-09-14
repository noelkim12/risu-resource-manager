export interface AINsettings {
	top_p: number;
	rep_pen: number;
	top_a: number;
	rep_pen_slope: number;
	rep_pen_range: number;
	typical_p: number;
	badwords: string;
	stoptokens: string;
	top_k: number;
}

export const defaultAIN: AINsettings = {
	top_p: 0.7,
	rep_pen: 1.0625,
	top_a: 0.08,
	rep_pen_slope: 1.7,
	rep_pen_range: 1024,
	typical_p: 1.0,
	badwords: "",
	stoptokens: "",
	top_k: 140,
};