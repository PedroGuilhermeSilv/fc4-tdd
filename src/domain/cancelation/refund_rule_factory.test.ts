import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund copy";
import { PartialRefund } from "./partial_refund";
import { RefundRuleFactory } from "./refund_rule_factory";

describe("RefundRuleFactory", () => {
    it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
        const refundRule = RefundRuleFactory.getRefundRule(8);
        expect(refundRule).toBeInstanceOf(FullRefund);
        expect(refundRule.calculateRefund(1000)).toBe(0);
    });

    it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
        const refundRule = RefundRuleFactory.getRefundRule(5);
        expect(refundRule).toBeInstanceOf(PartialRefund);
        expect(refundRule.calculateRefund(1000)).toBe(500);
    });

    it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
        const refundRule = RefundRuleFactory.getRefundRule(0);
        expect(refundRule).toBeInstanceOf(NoRefund);
        expect(refundRule.calculateRefund(1000)).toBe(1000);
    });
});
