/**
* @problem Является ли обьект ошибкой?
* @param {any} obj
* @return {boolean}
*/
export const isDontError = (obj: any): boolean => {
    if (obj instanceof Error) {
        return false;
    } else {
        return true;
    }
};
