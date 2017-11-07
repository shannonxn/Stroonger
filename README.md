# Stroonger

## Milestone 3: Admin, Company and Position

### Models
Admin.class</br>
AdminSession.class</br>
Comapny.class</br>
Position.class</br>

### REST
#### AdminInterface.class:
POST createAdmin

#### AdminSessionInterface:
POST createAdminSession: 
> emailAddress, password</br>
> adminToken, fN, lN, email

#### CompanyInterface.class:
POST createCompany:
> Admin Token Authentication

GET getAllCompany: 
> @QueryParam("search by company name/field")</br>
> @QueryParam("sort by company name/date")</br>
> @QueryParam("count")</br>
> @QueryParam("offset")

GET getCompanyById: 
> @PathParam("company id")

PATCH updateCompany:
> @PathParam("company id")</br>
> Admin Token Authentication

DELETE deleteCompany:
> @PathParam("company id")</br>
> Admin Token Authentication

POST addPositionToCompany:
> @PathParam("company id")</br>
> Admin Token Authentication

GET getAllPositionOfCompany:
> @PathParam("company id")</br>
> @QueryParam("search by position name/type")</br>
> @QueryParam("sort by position name/date")</br>
> @QueryParam("count")</br>
> @QueryParam("offset")

GET getPositionOfCompanyById: 
> @PathParam("company id")

PATCH updatePositionOfCompany:
> @PathParam("position id")</br>
> Admin Token Authentication

DELETE deletePositionOfCompany:
> @PathParam("position id")</br>
> Admin Token Authentication

GET getAllApplicationOfCompany:
> @PathParam("company id")</br>
> @QueryParam("sort by application date")</br>
> @QueryParam("count")</br>
> @QueryParam("offset")</br>
> Admin Token Authentication

#### PositionInterface.class:

GET getAllPosition: 
> @QueryParam("search by position name/type")</br>
> @QueryParam("sort by position name/date")</br>
> @QueryParam("count")</br>
> @QueryParam("offset")

GET getPositionById: 
> @PathParam("position id")

GET getAllApplicationOfPosition:
> @PathParam("position id")</br>
> @QueryParam("sort by application date")</br>
> @QueryParam("count")</br>
> @QueryParam("offset")</br>
> Admin Token Authentication













