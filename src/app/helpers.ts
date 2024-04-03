import { HttpErrorResponse } from '@angular/common/http';

import { Observable, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Buffer } from 'buffer';

import { Result, Err, Ok, Option, Some, None } from 'ts-results';

export class Helpers {
	public static formatHttpError(e: HttpErrorResponse) {
		let text = e.ok ? e.statusText : e.error;
		if (typeof text != 'string')
			text = e.statusText;
			
		return `(code ${e.status}) ${text}`;
	}
	
	public static bodyToHttpFormData(body: any) {
		let form = new FormData();
		Object.entries(body).forEach(x => {
			var k = x[0], v = <any>x[1];
			if (v != null)
				form.append(k, String(v));
		})
		return form;
	}
	public static bodyCombine(...bodies: any[]) {
		var res: any = {};
		bodies.forEach(x => {
			var bodyEntries = Object.entries(x).map(([k, v]) => [k, <any>v]);
			res = { ...res, ...bodyEntries };
		});
		return res;
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
	
	public static async observableAsPromise<T>(ob: Observable<T>): Promise<Result<T, any>> {
		return new Promise((resolve, reject) => {
			ob.subscribe({
				next: (x) => resolve(new Ok(x)),
				error: (e) => resolve(new Err(e)),
			});
		});
	}
	
	// -----------------------------------------------------
	
	public static strCaseCmp(s1: string, s2: string): boolean {
		return s1.toLowerCase() == s2.toLowerCase();
	}
	
	public static parseInt(s: string, radix?: number): Option<number> {
		if (s == null || s.length == 0)
			return None;
		var n = parseInt(s, radix);
		return isNaN(n) ? None : new Some(n);
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