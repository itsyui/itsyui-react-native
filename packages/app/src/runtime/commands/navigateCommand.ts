import { WidgetsFactory } from "@itsy-ui/core";
import { CommandOptions } from "@itsy-ui/core";
import { canExecuteCommand } from "../helpers/utils";
import { generateURLQueryParams } from "@itsy-ui/utils";

const dataLoader = WidgetsFactory.instance.services["DataLoaderFactory"];
const commandBindProvider = dataLoader.getLoader("commandBindProvider");


// navigate
commandBindProvider.putSchema("navigate", (metadata) => {
	const commandObj: CommandOptions<any> = {
		canExecute: (data: any, _transition: (data: any) => void) => {
			return canExecuteCommand(data["config"]);
		},
		execute: async (data: any, transition: (data: any) => void) => {
			const record = data.record ? data.record : {};
			if (metadata && metadata.pageURL) {
				transition({
					type: "NAVIGATE_URL",
					url: metadata["pageURL"],
					params: record
				});
				if (metadata.onEndTransitions && metadata.onEndTransitions.length > 0) {
					for (let index = 0; index < metadata.onEndTransitions.length; index++) {
						const element = metadata.onEndTransitions[index];
						if (element.type) {
							transition(element)
						}
					}
				}
			} else {
				console.log("Page URL is undefing")
			}

		},
	};
	return commandObj;
});