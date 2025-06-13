import { Tooltip } from "../inventory/Tooltip.js"

import * as FloatingUI from "../managers/Module_FloatingUI_DOM.js"

export class Community_Manager {
	constructor(runtime) {
		this.runtime = runtime
		this.runtime.commu = this

		console.error("commuManager", this)

		this.quests = new Map()

		this.CreateMenu_Community()
	}

	async Load_CommuData() {
		try {
		 
			const cacheBuster = Utils.generateUID()
			 
			const url = "raw/OverboyDev/noobs-utils/main/community.yml"

			console.log("Loading community data from URL:", url)

			this.commuData = await Promise.race([
				this.runtime.dataManager.DataFile_UrlToObject(url, true),
				new Promise((_, reject) => setTimeout(() => reject(new Error("Network request timed out")), 1500)),
			])

			console.log("Community data successfully loaded from remote source.")

			if (typeof this.commuData !== "object") {
				throw new Error("Invalid community data from remote source")
			}
		} catch (error) {
			console.error("Failed to load community data from URL:", error)

			// Try to load from local file as a fallback
			try {
				this.commuData = await this.runtime.dataManager.DataFile_UrlToObject("community.yml")
				console.log("Community data loaded from local file.")
			} catch (localError) {
				console.error("Failed to load community data from local file:", localError)
				this.commuData = {} // Assign a default empty object to avoid further errors
			}
		}

		// Ensure data is properly initialized to prevent crashes
		if (!this.commuData || typeof this.commuData !== "object") {
			console.error("Community data is invalid. Using default values.")
			this.commuData = {}
		}

		console.log("Final Community Data:", this.commuData)

		// Attempt to extract platform link if it exists
		this.SteamLink = this.commuData?.Platforms?.Steam?.Link || "No Steam link available"

		// Load quests if the data is available
		this.quests_toDo = this.commuData.QUESTS ? this.Load_CommuQuests(this.commuData.QUESTS) : []
	}

	Load_CommuQuests(quests) {
		for (const [name, quest] of Object.entries(quests)) {
			quest.Img = quest.Img + ".png"
			if (!quest.levelTier) quest.levelTier = 0

			quest.nameFull = name
			if (quest.nameFull) {
				// Find if the last word (preceded by a space) starts with a number
				const match = name.match(/^(.*)\s(\d[\w]*)$/)
				if (match) {
					quest.name = match[1]
					quest.level = match[2]
				} else {
					quest.name = name
					quest.level = 0
				}
			}

			quest.link = this.commuData.Platforms?.[quest.name]?.Link

			if (quest.name === "Youtube Subs") {
				quest.link = this.commuData.Platforms?.Youtube?.Link
			}

			const mission = Object.entries(quest.Missions)[0]

			const [missionKeyFull, missionValue] = mission

			quest.missionValue = missionValue
			quest.missionSplit = missionKeyFull.split("|")
			quest.missionKey = quest.missionSplit[0]
			const missionKey = quest.missionKey

			if (missionKey === "Follower") {
				quest.verb = "Follow"
			}

			if (missionKey === "Subscriber") {
				quest.verb = "Subscribe"
			}

			if (missionKey === "Wishlist") {
				quest.verb = "Wishlist_Verb"
			}

			if (missionKey === "Discord") {
				quest.verb = "Join"
			}

			quest.unlockPrefix = this.commuData._Default.UnlockPrefix

			this.runtime.progress.SetChallengeUnlocks(quest, quest)
		}

		//return the array of quests
		const questsArr = Object.values(quests)
		return questsArr
	}

	CreateMenu_Community() {
		this.commuMenu = this.runtime.menu.CreateMenuScreen("commuMenu", true, false)

		this.commuMenu.innerHTML = /*html*/ `
        <div id="" class="vertical justify_center items_center h100 w100" style="
           
           position: relative;
           
    
        ">

            <div class="vertical justify_center items_center h100 w100" style="
                z-index: 1;
            ">

                <div id="commu_Title" class="textOutline" style="
                    color: ${this.runtime.colorsText.Title};
                    font-weight: bold;
                    font-size: ${Utils.px(7)};
                    margin: ${Utils.px(4)};
                    padding: ${Utils.px(4)};
                    font-family: Arial, sans-serif;
                    background-color:rgba(0, 0, 0, 0.58);
                    border-radius: ${Utils.px(2)};
                ">
                </div>
                <div id="progress_Container" class="inlineFlex row items_start justify_center" style="
                    gap: ${Utils.px(10)};
                    height:${Utils.px(200)};
                    max-height:${Utils.px(200)};
                ">
                    
                    <div id="progress_Grids" class="vertical" style="
                        max-height:${Utils.px(200)};
                        width:${Utils.px(350)};
                        gap: ${Utils.px(1)};
                    ">
                        <div id="progress_Todo_Text">
                        </div>
                        <div id="progress_Todo" class="inventory_grid simplebar_white" style="
                            max-height:${Utils.px(100)};
                            ">
                        </div>
                        <div id="progress_Done_Text">
                        </div>
                        <div id="progress_Done" class="inventory_grid simplebar_white" style="
                            max-height:${Utils.px(100)};
                            ">
                        </div>
                        
                    </div>
                
                    

                    <div id="progress_Infos" class="vertical items_center" style="
                        width:${Utils.px(100)};
                        gap:${Utils.px(2)};
                    ">
                        <div id="progress_achieve_Text">
                        </div>
                        <div id="progress_achieve_Container" class="s100">
                        </div>
                        <div id="progress_Reward_Text">
                        </div>
                        <div id="progress_Reward" class= "vertical w100" style= "height:${Utils.px(120)};">
                        </div>
                        <div id="progress_Reward_Status">
                        </div>
                    </div>

                    <div id="end_Progress" class="column">

                    </div>
                
                
                </div>
                <div id="commu_Buttons" class="vertical" style="gap:${Utils.px(1)};">
                </div>
            </div>
            
        </div>
        `

		const progressBtns = this.runtime.menu.AddSettingsToID("commu_Buttons", "", "", false, [
			//! TODO
			/*
			{
				type: "toggle",
				label: "RewardAsIcon",
				callback: (bool) => {
					this.RewardAsIcon_Commu(bool)
				},
			},*/
			{
				type: "button",
				label: "Back",
				callback: () => {
					this.runtime.menu.Back()
				},
			},
		])

		this.commu_Title = this.commuMenu.querySelector("#commu_Title")
		this.runtime.translation.Elem_SetTranslateKey(this.commu_Title, "Community Goals")

		this.inventoryContent = this.commuMenu.querySelector("#progress_Todo")
		this.inventoryContent_done = this.commuMenu.querySelector("#progress_Done")

		this.rewardTooltip = new Tooltip(this.runtime, false)
		const progressReward = this.commuMenu.querySelector("#progress_Reward")
		progressReward.appendChild(this.rewardTooltip.element)

		const progressRewardText = this.commuMenu.querySelector("#progress_Reward_Text")
		this.runtime.translation.Elem_SetTranslateKey(progressRewardText, "Reward")

		const progressAchieveText = this.commuMenu.querySelector("#progress_achieve_Text")
		this.runtime.translation.Elem_SetTranslateKey(progressAchieveText, "Community Quest")

		const progressTodoText = this.commuMenu.querySelector("#progress_Todo_Text")
		this.runtime.translation.Elem_SetTranslateKey(progressTodoText, "In Progress")

		const progressDoneText = this.commuMenu.querySelector("#progress_Done_Text")
		this.runtime.translation.Elem_SetTranslateKey(progressDoneText, "Completed")

		this.achievement = this.CreateElem_Achieve(false)
		const achievementContainer = this.commuMenu.querySelector("#progress_achieve_Container")
		achievementContainer.appendChild(this.achievement)

		this.rewardStatus = this.commuMenu.querySelector("#progress_Reward_Status")

		//quest Tooltip
		const tempElem = document.createElement("div")
		tempElem.innerHTML = /*html*/ `
            <div class="questTooltip" style="
                display: none;
                background-color: rgba(1, 1, 1, 0.91);
                border-radius: ${Utils.px(2)};
                border: ${Utils.px(0.5)} solid rgb(172, 172, 172);
                position: absolute;
                border-radius: ${Utils.px(1)};
                padding: ${Utils.px(1)};
                z-index: 500;
                font-size: ${Utils.px(5)};
                word-break: break-word;
                overflow-wrap: anywhere;
            ">
            </div>
        `

		/*
        <div class="questTooltip" style="
            position: absolute;
            top: -${Utils.px(8)};
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: ${Utils.px(1)};
            font-size: ${Utils.px(4)};
            border-radius: ${Utils.px(1)};
            visibility: hidden;
            white-space: nowrap;
        ">
        </div>*/

		this.questTooltip = tempElem.querySelector(".questTooltip")
		this.commuMenu.appendChild(this.questTooltip)
	}

	CreateElem_Achieve(set = true) {
		const tempContainer = document.createElement("div")

		tempContainer.innerHTML = /*html*/ `
        <div id="progress_Achieve" class= "horizontal" style= 
            "height:${Utils.px(40)};
            padding:${Utils.px(2)}; 
            gap:${Utils.px(2)};"
        >
        
            <div class="achieveImgContain flex justify_center items_center" style="
                        padding:${Utils.px(1)};
                        
                        height:${Utils.px(16)};
                        width:${Utils.px(16)};
                        border-radius: ${Utils.px(2)};
                        overflow: hidden;
                        flex-shrink: 0;
                        ">
                <img class="achieveImg" 
                    src="random_icon.png" onerror="this.src='random_icon.png'; item.img = item.src"
                    style="
                        max-height: 100%;
                        max-width: 100%;
                        object-fit: contain;
                        
                "/>  
            </div>
            <div class="vertical" style= 
                "margin-left:${Utils.px(1)};
            ">
                <div class="itemTitle" style="
                    font-size:${Utils.px(7)};
                "></div>
                <div class="itemTags" style="
                    font-size:${Utils.px(5)};
                "></div>
            </div>
        </div>
        `

		const achieveImgContain = tempContainer.querySelector(".achieveImgContain")
		//achieveImgContain.style.background = `linear-gradient(360deg,rgb(50, 50, 50),rgb(19, 19, 19)`

		this.runtime.style.Elem_ItemStyleFrame(achieveImgContain)

		const createdElem = tempContainer.firstElementChild

		this.runtime.style.Elem_BoxStyle(createdElem, "TIER_0")

		//if (set) this.SetHTML_Achieve(createdElem)

		return createdElem
	}

	RewardAsIcon_Commu(bool) {
		const chalArray = Array.from(this.quests.values())

		for (const challenge of chalArray) {
			const itemIcon = challenge.box.querySelector("#itemIcon")
			if (bool) itemIcon.src = challenge?.unlockedItem?.img || "random_icon.png"
			else itemIcon.src = challenge.img || "random_icon.png"

			let tier = 0

			if (bool) tier = challenge?.unlockedItem?.evolution || 0
			else tier = challenge.levelTier || 0

			const key = "TIER_" + tier

			//this.runtime.style.Elem_ItemStyle(challenge.box, key)

			this.runtime.style.Elem_ItemStyleFrame(challenge.box, tier)
		}
	}

	HTML_SetCommuMenu() {
		this.Refresh()
	}

	FormatNumber(num) {
		if (num >= 1_000_000_000) {
			return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B"
		} else if (num >= 1_000_000) {
			return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
		} else if (num >= 1_000) {
			return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
		}
		return num.toString()
	}

	SetHTML_Quest(quest) {
		const elem = this.achievement
		const achieveImg = elem.querySelector(".achieveImg")
		const achieveTitle = elem.querySelector(".itemTitle")
		const achieveTags = elem.querySelector(".itemTags")

		const achieveBoxStyle = this.runtime.style.Elem_BoxStyle(elem, "TIER_" + quest.levelTier, 5)

		achieveImg.src = quest.Img

		achieveTitle.innerHTML = quest.name

		/*
		let translateKey = this.challNameKey
		if (this.runtime.translation.HasKey("Chal_" + this.challNameKey)) {
			translateKey = "Chal_" + this.challNameKey
		}

		//Utils.Elem_SetTranslateKey(achieveTitle, translateKey)

		achieveTitle.innerHTML = this.runtime.translation.Get(translateKey)*/

		if (quest.level) achieveTitle.innerHTML += " " + quest.level

		const missionSplit = quest.missionSplit
		const missionKey = quest.missionKey
		const missionValue = quest.missionValue

		let missionText = this.runtime.translation.Get("Quest_" + missionKey)

		let valueCurrent = 0

		let valueText = this.FormatNumber(missionValue)

		missionText = missionText.replace("{x}", "[c=yellow]" + valueText + "[/c]")

		if (missionKey === "Follower" || missionKey === "Subscriber") {
			const platform = missionSplit[1]

			missionText = missionText.replace("{platform}", platform)

			valueCurrent = this.commuData.Platforms[platform].Follow
		}

		if (missionKey === "Wishlist") {
			valueCurrent = this.commuData.Platforms.Steam.Wishlist
		}

		if (missionKey === "Twitch_Watchers") {
			valueCurrent = this.commuData.Platforms.Twitch.Watcher
		}

		if (missionKey === "Discord") {
			valueCurrent = this.commuData.Platforms.Discord.Follow
		}

		if (missionKey === "Youtube_MostWatched") {
			valueCurrent = this.commuData.Platforms.Youtube.MostWatched
		}

		const gameTitle = this.runtime.translation.Get("Game_Title")

		missionText = missionText.replace("{game}", "[c=yellow]" + gameTitle + "[/c]")

		let colorProgress = this.runtime.colorsText.Gray
		let progressText = valueCurrent + " / " + missionValue
		if (valueCurrent >= missionValue) {
			colorProgress = "rgba(0, 255, 0, 0.75)"
			const completed = this.runtime.translation.Get("Completed")
			progressText = `(${completed}: ${progressText})`
		}

		missionText += /*html*/ `<br>
            <span style="color: ${colorProgress};">
            ${progressText}
            <span>
        `

		missionText = Utils.parseBBCode(missionText)

		achieveTags.innerHTML = missionText
	}

	Refresh() {
		this.inventoryContent_done.innerHTML = ""

		const chalArray = this.quests_toDo

		//Demo: fill
		/*
		for (let i = 0; i < 120; i++) {
			chalArray.push({
				img: "locked_fullGame.png",
				LockedBy: "Demo",
			})
		}*/

		const inventoryHtml = chalArray
			.map((item, index) => {
				return /*html*/ `
                <div class="itemBox" data-item-index="${index}" style="position:relative;">
                    <img id="itemIcon" src="${item.Img}" draggable="false" 
                        onerror="this.onerror=null; this.src='random_icon.png';">

                    
                    <div id="grayOut" style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5); /* Adjust opacity as needed */
                        pointer-events: none; /* Ensure clicks pass through */
                    "></div>
                    <img id="lockedIcon" src="locked_icon.png"
                        style="
                            position: absolute;
                            width: ${Utils.px(10)};
                            height: ${Utils.px(10)};
                            bottom: 0;
                            right: 0;
                    ">
                    <div class="objective" style="
                        position: absolute;
                        bottom:  ${Utils.px(1)};
                        left: ${Utils.px(1)};
                        background-color: rgba(0, 0, 0, 0.7);
                        opacity: 0.8;
                        color: white;
                        padding: ${Utils.px(0.2)};
                        font-size: ${Utils.px(3)};
                        border-radius: ${Utils.px(1)};
                    ">
                    </div>
                    
                </div>
            `
			})
			.join("")

		this.inventoryContent.innerHTML = inventoryHtml

		this.runtime.style.Elem_BoxStyle(this.inventoryContent, "", 3)
		this.runtime.style.Elem_BoxStyle(this.inventoryContent_done, "", 3)

		//only select items children of this.element

		const items = this.inventoryContent.querySelectorAll(".itemBox")

		//const tooltip = document.querySelector(".tooltip")

		const player = this.runtime.player

		items.forEach((item) => {
			const itemIndex = item.getAttribute("data-item-index")
			const challenge = chalArray[itemIndex]

			const key = "TIER_" + (challenge.levelTier || 0)

			//this.runtime.style.Elem_ItemStyle(item, key)

			this.runtime.style.Elem_ItemStyleFrame(item, challenge.levelTier || 0)

			Utils.Elem_FocusableOutline(item)

			const lockedIcon = item.querySelector("#lockedIcon")
			const grayOut = item.querySelector("#grayOut")
			const objective = item.querySelector(".objective")

			objective.textContent = challenge.level

			const itemClass = challenge.unlockedItem

			challenge.box = item
			challenge.lockedIcon = lockedIcon
			challenge.grayOut = grayOut

			if (challenge.DONE) {
				grayOut.style.display = "none"
				lockedIcon.style.display = "none"
			}

			item.player = player
			item.itemClass = itemClass

			// Click event for item
			item.addEventListener("sn:pressed", (e) => {
				if (challenge.name === "Wishlists" || challenge.name.includes("Steam")) {
					this.runtime.menu.OpenSteamPage_App()
				} else if (challenge.linkCallback) {
					challenge.linkCallback()
				} else if (challenge.link) {
					window.open(challenge.link, "_blank")
				}
			})

			item.addEventListener("sn:rightclick", (e) => {
				e.preventDefault()
				if (this.runtime.isCheating) {
					const bool = !challenge.completed
					challenge.SetCompleted(bool, false)
				}
			})

			const focus = async () => {
				/*if (!challenge.completed) {
					this.LockedItem(item)
				}*/

				this.SetHTML_Quest(challenge)
				if (itemClass) {
					this.rewardTooltip.element.style.visibility = "visible"
					this.rewardTooltip.SetTooltipFromItem(itemClass, player, "challengeReward")
				} else {
					this.rewardTooltip.element.style.visibility = "hidden"
				}

				this.questTooltip.style.display = "flex"
				if (!challenge.verb) {
					this.questTooltip.style.display = "none"
				}

				this.questTooltip.innerText = this.runtime.translation.Get(challenge.verb)

				await Utils.Elem_FloatingUI(item, this.questTooltip, null, {
					placement: "top",
					middleware: [FloatingUI.offset(10), FloatingUI.flip(), FloatingUI.shift()],
				})
			}

			const unfocus = () => {
				this.questTooltip.style.display = "none"
				/*
				this.rewardTooltip.element.style.visibility = "hidden"
                */
			}

			Utils.Elem_Focusable(item, focus, unfocus)
		})

		// Move completed challenges to inventoryContent_done
		const completedItems = []
		items.forEach((item) => {
			const itemIndex = item.getAttribute("data-item-index")
			const challenge = chalArray[itemIndex]

			if (challenge.DONE) {
				completedItems.push(item)
			}
		})

		// Remove completed items from inventoryContent and add them to inventoryContent_done
		completedItems.forEach((item) => {
			this.inventoryContent.removeChild(item)
			this.inventoryContent_done.appendChild(item)
		})
	}
}
