export function stripHtml(htmlString: string): string {
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
}