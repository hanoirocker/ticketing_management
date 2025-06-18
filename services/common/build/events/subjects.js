"use strict";
// Subjects in world of NATS is name of a channel. We define them as enums
// for all event types to declare
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subjects = void 0;
var Subjects;
(function (Subjects) {
    Subjects["TicketCreated"] = "ticket:created";
    Subjects["TicketUpdated"] = "ticket:updated";
    Subjects["OrderCreated"] = "order:created";
    Subjects["OrderCancelled"] = "order:cancelled";
})(Subjects || (exports.Subjects = Subjects = {}));
