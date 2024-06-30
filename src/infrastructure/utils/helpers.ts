export const acceptFile = (file: string, _type: string = '') => {
    let accpt = '';
    let typeFile = _type || '';
    if (file && typeFile === '') {
        typeFile = file.slice(file.lastIndexOf('.') + 1);
    }
    // png, jpeg, jpg, pdf, xlsx, xls, doc, docx, ppt, pptx, zip, rar and max file size is 5Mb per file.
    switch (typeFile.toLocaleLowerCase()) {
        case 'png': {
            accpt = 'image/png';
            break;
        }
        case 'jpeg': {
            accpt = 'image/jpg';
            break;
        }
        case 'jpg': {
            accpt = 'image/jpg';
            break;
        }

        case 'pdf': {
            accpt = 'application/pdf';
            break;
        }

        default:
            accpt = 'application/octet-stream';
    }

    return accpt;
};

export const refactorFormDataCommon = (data: any) => {
    let result: any = {};
    if (Object.keys(data)?.length) {
        Object.keys(data).forEach((key) => {
            if (typeof data[key] === 'string') {
                result = {
                    ...result,
                    [key]: data[key]?.trim() || '',
                };
            } else {
                result = {
                    ...result,
                    [key]: data[key],
                };
            }
        });
    }
    return result;
};