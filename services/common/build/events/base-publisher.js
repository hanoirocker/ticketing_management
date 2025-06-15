"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
class Publisher {
    constructor(client) {
        this.client = client;
    }
    // Publish the event including channel name and data.
    // Third argument is an optional callback.
    publish(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.client.publish(this.subject, JSON.stringify(data), (err) => {
                    // if any error is returned in thse promise, return earlier and reject the promise
                    if (err)
                        reject(err);
                    // if no errors received, resolve the promise with void return
                    console.log('Event published to subject: ', this.subject);
                    resolve();
                });
            });
        });
    }
}
exports.Publisher = Publisher;
