export class Fact {
    id: string;
    message: string;
    url: string;

    constructor(
        key: string,
        value: any
    ) {
        this.id = key;
        this.message = value['message'];
        this.url = value['url'];
    }
}
