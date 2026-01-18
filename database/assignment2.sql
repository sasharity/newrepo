-- Insert new record to account table
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)

VALUES ('Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronMan');

-- Modify record to change account type
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete Tony Stark record from database
DELETE from public.account
WHERE account_id = 1;

-- Modify the GM Hummer record
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
	and inv_model = 'Hummer';

-- Using inner join to select fields from inventory and classification table
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c
	ON i.classification_id = c.classification_id
WHERE classification_name = 'Sport';


-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns 
UPDATE public.inventory
SET 
	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
