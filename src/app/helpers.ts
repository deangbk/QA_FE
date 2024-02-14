
import { Buffer } from 'buffer';

export class Helpers {
	public static bodyToHttpFormData(body: any) {
		let form = new FormData();
		Object.entries(body).forEach(x => {
			var k = x[0], v = <any>x[1];
			if (v != null)
				form.append(k, String(v));
		})
		return form;
	}
	public static bodyToHttpQueryString(body: any, ...more: [string, any][]) {
		var bodyAsAny = Object.entries(body).map(([k, v]) => [k, <any>v]);
		var values = bodyAsAny.concat(more)
			.filter(([k, v]) => v != null)
			.map(([k, v]) => `${k}=${String(v)}`);
		return values.join('&');
	}
	
	public static parseJwt(token: string) {
		var base64Payload = token.split('.')[1];
		var payload = Buffer.from(base64Payload, 'base64');
		return JSON.parse(payload.toString());
	}
	
	// -----------------------------------------------------
	
	public static arrayBufferToByteArray(buffer: ArrayBuffer) {
		const textDecoder = new TextDecoder('utf-8');
		const decodedBase64 = textDecoder.decode(buffer);
		return Uint8Array.from(
			atob(decodedBase64), c => c.charCodeAt(0))
	}
	
	// -----------------------------------------------------
	
	public static waitUntil(cond: Function): Promise<any> {
		const poll = (resolve: any) => {
			if (cond()) resolve();
			else setTimeout(() => poll(resolve), 100);
		}
		return new Promise(poll);
	};
	public static timeout(ms: number): Promise<any> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	// -----------------------------------------------------
	
	public static lerp(from: any, to: any, x: number) {
		return from + x * (to - from);
	}
	public static lerpColor(rgb1: number[], rgb2: number[], x: number) {
		var r = this.lerp(rgb1[0], rgb2[0], x);
		var g = this.lerp(rgb1[1], rgb2[1], x);
		var b = this.lerp(rgb1[2], rgb2[2], x);
		return `rgb(${r}, ${g}, ${b})`
	}
	
	// -----------------------------------------------------
	
	public static chunkString(str: string, chunk: number) {
		const size = Math.floor(str.length / chunk)
		var res: string[] = [];
		for (let i = 0; i < size; i++) {
			const offset = i * chunk;
			res.push(str.substring(offset, offset + chunk));
		}
		return res;
	}
}