-- Enable Insert for Orders and Order Items to facilitate public/authenticated checkout

-- Orders Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users to place orders"
ON public.orders
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable select for owners of orders"
ON public.orders
FOR SELECT
USING (auth.uid() = profile_id OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Order Items Policies
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for order items based on order access"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = order_id
  )
);

CREATE POLICY "Enable select for order items of owned orders"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = order_id
    AND (auth.uid() = profile_id OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
);
