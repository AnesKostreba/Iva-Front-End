import CartType from "./CartType";

export default interface OrderType {
    orderId: number;
    createdAt: string;
    cart: CartType;
    status: string
}