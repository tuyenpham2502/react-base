import Constants from "@/core/application/common/constants";
import LocalStorageService from "@/infrastructure/services/localStorage.service";
import CookiesStorageService from "@/infrastructure/services/cookiesStorage.service";

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

export const _t = (key: any, ...params: any[]) => {
  let localStorageService = new LocalStorageService();
  let languageSelected: any = localStorageService.readStorage(Constants.LANGUAGE_SELECTED_STORAGE);

  let languagesData: any = localStorageService.readStorage(Constants.LIST_DATA_TRANSLATE_STORAGE);
  let dataByKey: any =
    languageSelected && languagesData && languagesData[key] ? languagesData[key][languageSelected?.value] : null;

  // Find the key
  const rawTranslation = dataByKey;
  // Set the translation as the key as default, in case of not found
  let translation = key;
  // Set the translation as the found one
  if (rawTranslation) {
    translation = rawTranslation;
  }
  // parse the prams
  if (params != null && params.length > 0) {
    for (let i = 0; i < params.length; i++) {
      translation = translation.replace(`{${i}}`, params[i]);
    }
  }
  return translation;
};

export const getListRole = () => {
  const cookiesStorageService = new CookiesStorageService();

  let role = cookiesStorageService.readStorage(Constants.API_ROLE_STORAGE);
  return role != null ? [role.toString()] : [];
};