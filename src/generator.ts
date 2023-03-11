import * as ps from "./load_asset"

type GenerateOpenBookPs1 = {
  (params: Ps1GenerateParams): string
}

type GeneratePushPs1 = {
  (params: Ps1GenerateParams): string
}

type GeneratePullPs1 = {
  (params: Ps1GenerateParams): string
}

type GenerateRunMacroPs1 = {
  (params: Ps1GenerateParams): string
}

type GenerateGitignore = {
  (): string
}

type GenerateWorkspace = {
  (): string
}

type GenerateBarrettaLauncher = {
  (): string
}

type Ps1GenerateParams = {
  rootPath: string,
  fileName: string,
  callMethod?: string,
  methodParams?: (string | number | boolean)[] | undefined,
  pullIgnoreDocument?: boolean,
  pushIgnoreDocument?: boolean
}

/**
 * ExcelBookを開くPowershellスクリプトを返します。
 * @param genParams
 * @returns
 */
export const generateOpenBookPs1: GenerateOpenBookPs1 = (genParams) => {
  //引数をPowerShellスクリプトに埋め込む
  const test: string = ps.default.openExcelbook as string
  console.log("src", test)
  const pwshWithArgs: string = ps.default.openExcelbook
    .replace(/{{argument1}}/g, genParams.rootPath)
    .replace(/{{argument2}}/g, genParams.fileName)

  console.log("changed", pwshWithArgs)
  return pwshWithArgs
}

/**
 * type guard function to check if a value is a boolean
 * @param value 
 *  @type unknown
 * @returns If `value` is a boolean, should return `true`.
 */
const isBoolean = (value: unknown): value is boolean => {
  return value !== undefined && typeof value === "boolean"
}

/**
 * type guard function to check if a value is a string
 * @param value
 * @returns If `value` is a string, should return `true`.
 */
const isString = (value: unknown): value is string => {
  return value !== undefined && typeof value === "string"
}

export const generatePushPs1: GeneratePushPs1 = (genParams) => {
  //引数をPowerShellスクリプトに埋め込む
  const pwshWithArgs = ps.default.pushToExcelbook
    .replace(/{{argument1}}/g, genParams.rootPath)
    .replace(/{{argument2}}/g, genParams.fileName)
    .replace(/{{argument3}}/g, () => {
      if (isBoolean(genParams.pushIgnoreDocument)) {
        return genParams.pushIgnoreDocument ? "true" : "false"
      } else {
        return "false"
      }
    })

  return pwshWithArgs
}

/**
 * @param genParams
 * @returns
 */
export const generatePullPs1: GeneratePullPs1 = (genParams) => {
  //引数をPowerShellスクリプトに埋め込む
  const pwshWithArgs = ps.default.pullFromExcelbook
    .replace(/{{argument1}}/g, genParams.rootPath)
    .replace(/{{argument2}}/g, genParams.fileName)
    .replace(/{{argument3}}/g, () => {
      if (isBoolean(genParams.pullIgnoreDocument)) {
        return genParams.pullIgnoreDocument ? "true" : "false"
      } else {
        return "false"
      }
    })

  return pwshWithArgs
}

export const generateRunMacroPs1: GenerateRunMacroPs1 = (params) => {
  let paramsText = "";
  if (params.methodParams !== undefined) {
    params.methodParams.forEach((param) => {
      if (typeof param === "string") {
        paramsText = `${paramsText}, "${param}"`;
      } else {
        paramsText = `${paramsText}, ${param}`;
      }
    });
  }
  //引数をPowerShellスクリプトに埋め込む
  const pwshWithArgs = ps.default.pullFromExcelbook
    .replace(/{{argument1}}/g, params.rootPath)
    .replace(/{{argument2}}/g, params.fileName)
    .replace(/{{argument3}}/g, () => {
      if (isString(params.callMethod)) {
        return params.callMethod
      } else {
        throw new Error("callMethodIsNull");
      }
    })
    .replace(/{{argument4}}/g, paramsText)
  return pwshWithArgs;
};

export const generateGitignore: GenerateGitignore = () => {
  return `excel_file`;
};

export const generateWorkspace: GenerateWorkspace = (): string => {
  const jsonData = {
    folders: [
      {
        path: ".",
      },
    ],
    settings: {
      "files.associations": {
        "*.cls": "vb",
        "*.bas": "vb",
        "*.frm": "vb",
      },
    },
  };
  return JSON.stringify(jsonData, null, 2);
};

export const generateBarrettaLauncher: GenerateBarrettaLauncher =
  (): string => {
    const jsonData = {
      macros: [
        {
          title: "My 1st Macro.",
          call: "ThisWorkbook.SampleMacro1",
          args: [],
          description:
            "When calling a function with no arguments, it is important not to specify values in the 'args' array.",
        },
        {
          title: "My 2nd Macro.",
          call: "ThisWorkbook.SampleMacro2",
          args: ["Hello", "Barretta", "!!!!!"],
          description:
            "The three strings specified in the argument will be combined and displayed in an Excel message box.",
        },
        {
          title: "My 3rd Macro.",
          call: "ThisWorkbook.SampleMacro3",
          args: [2000, 222],
          description:
            "The two numbers specified in the argument will be combined and displayed in an Excel message box.",
        },
      ],
    };
    return JSON.stringify(jsonData, null, 2);
  };
exports;
