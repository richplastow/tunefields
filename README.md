# Tunefields

> A creative music game, built using Next.js, Nx and react-three-fiber

- Created 20240604
- Rich Plastow
- <https://github.com/richplastow/tunefields>
- <https://richplastow.com/tunefields/>

## Tunefields architecture

__Tunefields consists of three Next.js (React) front-end apps:__

__'admin'__ lets system administrators monitor the server and app usage, and
manage user accounts. <https://richplastow.com/tunefields/admin>

__'make'__ takes the user on a creative journey, where they gather 'Prunables'
from a 3D world, assemble Prunables into 'Loops', and combine Loops into 'Tunes'.
<https://richplastow.com/tunefields/make>

__'view'__ is small app, essentially a cut-down version of 'make', which lets
anonymous users play and discover published Tunes.
<https://richplastow.com/tunefields/>

All three Tunefields apps make use of a [Gus (Generic User Server)](
https://github.com/richplastow/gus) instance running on AWS to handle auth,
store user accounts, send emails for sign-up or password reset, store created
Tunes, and store app usage statistics.
