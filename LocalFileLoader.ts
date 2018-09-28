export default class LocalFileLoader {
    private request: XMLHttpRequest = new XMLHttpRequest();

    public loadAsText(filename: string, onload: (data: string | null) => any): void {
        this.request.open('get', filename, true);
        this.request.responseType = 'text';
        this.request.onload = (ev: Event): any => {
            this.request = ev.currentTarget as XMLHttpRequest;
            if (this.request) {
                onload(this.request.responseText);
            } else {
                onload(null);
            }
        };
        this.request.send();
    }

    public loadAsBinary(filename: string, onload: (buffer: ArrayBuffer | null) => any): void {
        this.request.open('get', filename, true);
        this.request.responseType = 'arraybuffer';
        this.request.onload = (ev: Event): any => {
            this.request = ev.currentTarget as XMLHttpRequest;
            if (this.request) {
                onload(this.request.response);
            } else {
                onload(null);
            }
        };
        this.request.send();
    }
}
