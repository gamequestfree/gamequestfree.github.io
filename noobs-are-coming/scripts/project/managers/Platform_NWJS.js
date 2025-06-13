export class Platform_NWJS {
	constructor(runtime) {
		this.runtime = runtime

		const nwjs = sdk_runtime.GetObjectClassByName("NWJS")._instances[0]._sdkInst
		if (nwjs) {
			console.error("NWJS", nwjs)
			this.sdkInst = nwjs
		}
	}

	ListContent(folderPath) {
		const result = []
		this.ListContent_NonRec(folderPath)
		const fileList = this.sdkInst._fileList
		console.error("NWJS _fileList", fileList)

		const fileNames = fileList.filter((item) => item.includes("."))
		const folderNames = fileList.filter((item) => !item.includes("."))

		for (const fileName of fileNames) {
			let filePath = folderPath ? folderPath + "/" + fileName : fileName
			result.push(filePath)
		}

		//const ignoredFoolders = ["_ideas-trash", "swiftshader"];

		for (const folderName of folderNames) {
			/*if (ignoredFoolders.includes(folderName)) {
          continue;
        }*/
			const subFolderPath = folderPath ? folderPath + "/" + folderName : folderName
			const subFiles = this.ListContent(subFolderPath)
			result.push(...subFiles)
		}
		return result
	}

	ListContent_NonRec(folderPath) {
		const listContent = C3.Plugins.NodeWebkit.Acts.ListFiles.bind(this.sdkInst)
		listContent(folderPath)
	}

	AppFolder() {
		return this.sdkInst._appFolder
	}

	UserFolder() {
		return this.sdkInst._userFolder
	}
}
