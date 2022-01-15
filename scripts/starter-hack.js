/** @param {NS} ns **/
export async function main(ns) {

	let target = ns.args[0];
	ns.print(`Starting hack on ${target}`);

	//75% of the servers max money
	let moneyThreshold = ns.getServerMaxMoney(target) * 0.75;

	// 5 levels above the minimum
	let securityThreshold = ns.getServerMinSecurityLevel(target) + 5;

	if (ns.fileExists('BruteSSH.exe', 'home')) {
		ns.print('Running BruteSSH.exe');
		ns.brutessh(target);
	}

	let hasRoot = ns.hasRootAccess(target);
	if (!hasRoot) {
		ns.print('running nuke for root access!');
		ns.nuke(target);
	}

	while (true) {
		let securityLevel = ns.getServerSecurityLevel(target);
		let moneyAvailable = ns.getServerMoneyAvailable(target);

		if (securityLevel > securityThreshold) {
			ns.print(`security level [${securityLevel}] higher than our threshold of [${securityThreshold}]. Weaken.\n`)
			await ns.weaken(target);
		} else if (moneyAvailable < moneyThreshold) {
			ns.print(`Cash on hand /$${moneyAvailable} is less than our threshold \$${moneyThreshold}. Grow.\n`)
			await ns.grow(target);
		} else {
			ns.print("all conditions met. commence the hackering! \n");
			await ns.hack(target);
		}

	}
}