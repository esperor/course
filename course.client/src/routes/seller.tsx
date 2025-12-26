import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/seller')({
  component: Seller,
});

function Seller() {
    return (
        <div>
            Seller
        </div>
    );
}