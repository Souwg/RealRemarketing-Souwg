"""empty message

Revision ID: 76626fec3913
Revises: d57b12220711
Create Date: 2025-01-15 21:01:57.960169

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '76626fec3913'
down_revision = 'd57b12220711'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('parcel')
    with op.batch_alter_table('files', schema=None) as batch_op:
        batch_op.add_column(sa.Column('Zoning', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('YearBuilt', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('ImprovVal', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('LandVal', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('ParVal', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('MailAdd', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('MailCity', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('MailState', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('MailZip', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('MailCountry', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('Address', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('Lat', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('Lon', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('LL_GisAcre', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('LL_GisSqFt', sa.String(length=255), nullable=True))
        batch_op.drop_column('Range')
        batch_op.drop_column('County')
        batch_op.drop_column('StartingBid')
        batch_op.drop_column('Section')
        batch_op.drop_column('Filename')
        batch_op.drop_column('State')
        batch_op.drop_column('Township')
        batch_op.drop_column('Acres')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('files', schema=None) as batch_op:
        batch_op.add_column(sa.Column('Acres', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('Township', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('State', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('Filename', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('Section', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('StartingBid', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('County', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('Range', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
        batch_op.drop_column('LL_GisSqFt')
        batch_op.drop_column('LL_GisAcre')
        batch_op.drop_column('Lon')
        batch_op.drop_column('Lat')
        batch_op.drop_column('Address')
        batch_op.drop_column('MailCountry')
        batch_op.drop_column('MailZip')
        batch_op.drop_column('MailState')
        batch_op.drop_column('MailCity')
        batch_op.drop_column('MailAdd')
        batch_op.drop_column('ParVal')
        batch_op.drop_column('LandVal')
        batch_op.drop_column('ImprovVal')
        batch_op.drop_column('YearBuilt')
        batch_op.drop_column('Zoning')

    op.create_table('parcel',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('parcel_number', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('owner', sa.VARCHAR(length=120), autoincrement=False, nullable=True),
    sa.Column('zoning', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('year_built', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('improvement_value', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('land_value', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('parcel_value', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('mail_address', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('mail_city', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
    sa.Column('mail_state', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('mail_zip', sa.VARCHAR(length=20), autoincrement=False, nullable=True),
    sa.Column('mail_country', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('address', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('latitude', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('longitude', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('acre', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('acre_sqft', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='parcel_pkey'),
    sa.UniqueConstraint('parcel_number', name='parcel_parcel_number_key')
    )
    # ### end Alembic commands ###
