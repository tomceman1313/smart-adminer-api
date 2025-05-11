import { shouldRenormalize } from "../orderingPrismaHelpers";

describe("Test shouldRenormalize()", () => {
	it("First position - should not renormalize", () => {
		const result = shouldRenormalize(10, 0, 5, false, true);

		expect(result).toEqual(false);
	});

	it("First position - should renormalize", () => {
		const result = shouldRenormalize(6, 0, 5, false, true);

		expect(result).toEqual(true);
	});

	it("Last position - should not renormalize", () => {
		const result = shouldRenormalize(10, 15, 0, true, false);

		expect(result).toEqual(false);
	});

	it("Last position - should renormalize", () => {
		const result = shouldRenormalize(14, 15, 0, true, false);

		expect(result).toEqual(true);
	});

	it("Middle position - should not renormalize", () => {
		const result = shouldRenormalize(13, 15, 5, true, true);

		expect(result).toEqual(false);
	});

	it("Middle position - should renormalize (both)", () => {
		const result = shouldRenormalize(10, 11, 9, true, true);

		expect(result).toEqual(true);
	});

	it("Middle position - should renormalize (before)", () => {
		const result = shouldRenormalize(10, 11, 5, true, true);

		expect(result).toEqual(true);
	});

	it("Middle position - should renormalize (after)", () => {
		const result = shouldRenormalize(10, 15, 9, true, true);

		expect(result).toEqual(true);
	});
});
