/** @param {NS} ns **/
export async function main(ns) {

	if (ns.args.length < 3) {
		ns.alert("This script takes 3 arguments. a target. a float for $ percentage and an int for security level");
	}

	const target = ns.args[0];
	ns.print(`Starting hack on ${target}`);

	const moneyPercent = parseFloat(ns.args[1]);
	const securityAddition = parseInt(ns.args[2]);

	//x% of the current servers money
	const moneyThreshold = ns.getServerMaxMoney(target) * moneyPercent;

	// x levels above the minimum
	const securityThreshold = ns.getServerMinSecurityLevel(target) + securityAddition;

	if (ns.fileExists('BruteSSH.exe', 'home')) {
		ns.print('Running BruteSSH.exe');
		ns.brutessh(target);
	}

	const hasRoot = ns.hasRootAccess(target);
	if (!hasRoot) {
		ns.print('running nuke for root access!');
		ns.nuke(target);
	}

	while (true) {

		const securityLevel = ns.getServerSecurityLevel(target);
		const moneyAvailable = ns.getServerMoneyAvailable(target);

		if (moneyAvailable < moneyThreshold) {
			await growUntil(ns, target, moneyThreshold);
		}

		if (securityLevel > securityThreshold) {
			await weakenUntil(ns, target, securityThreshold);
		}

		ns.print('all conditons met. commence the hacerking \n');
		await ns.hack(target);
	}
}

/** @param {NS} ns **/
async function growUntil(ns, target, threshold) {
	const current = ns.getServerMoneyAvailable(target);
	const difference = threshold - current;
	ns.print(`there is a \$${difference} between the current funds and the threshold.`);

	const runs = ns.growthAnalyze(target, difference, 1);
	ns.print(`Its going to take [${runs}] to get to our threshold`);

	let currentRun = 0;
	while (currentRun < runs) {
		ns.print(`Growth round [${currentRun}]`);
		await ns.grow(target);
		currentRun++;
	}
	ns.print("\n");
}

/** @param {NS} ns **/
async function weakenUntil(ns, server, threshold) {
	let current = ns.getServerSecurityLevel(server);

	let runs = 0;
	while (current > threshold) {
		const differnce = current - threshold;
		ns.print(`There is a [${differnce}] in the current security level and our threshold.]`);
		await ns.weaken(server);

		current = ns.getServerSecurityLevel(server);
		runs++;
	}

	ns.print(`It took [${runs}] to weaken this server!\n`);
}